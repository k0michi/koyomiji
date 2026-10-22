# LLVM JIT (ORCv2)に入門してみる

LLVMはJITコンパイラORCv2が含まれており、AOTコンパイルせずにLLVM IRを実行することができるので、それを試してみる。Juliaもこれを使っているらしい。

## LLVMをインストール

`brew`でインストールする。

```
brew install llvm
```

## LLVM JITで足し算

```cpp
int add(int a, int b) {
  return a + b;
}
```

をLLVM APIで書いて、それをORCv2で実行してみる。

`createAddModule`で`add`関数を含むモジュールを定義し、`main`でそれをJIT実行する。

`llvm::orc::ThreadSafeModule`は、ORCv2が並列コンパイルするために必要とドキュメントには書かれている。LLVMのデフォルトの`Module`は、スレッドセーフではないため、`llvm::orc::ThreadSafeModule`でラップしている。

LLVM APIでは例外は`llvm::Error`や`llvm::Expected`で表現されるので、適切にアンラップを行う。

```cpp
#include <llvm/ExecutionEngine/Orc/LLJIT.h>
#include <llvm/IR/IRBuilder.h>
#include <llvm/IR/LLVMContext.h>
#include <llvm/IR/Module.h>
#include <llvm/Support/InitLLVM.h>
#include <llvm/Support/TargetSelect.h>
#include <llvm/Support/raw_ostream.h>

#include <iostream>
#include <memory>

llvm::orc::ThreadSafeModule createAddModule() {
  auto context = std::make_unique<llvm::LLVMContext>();
  auto module = std::make_unique<llvm::Module>("module", *context);
  llvm::IRBuilder<> builder(*context);

  llvm::Type *i32Type = builder.getInt32Ty();
  llvm::FunctionType *funcType =
      llvm::FunctionType::get(i32Type, {i32Type, i32Type}, false);

  llvm::Function *addFunc = llvm::Function::Create(
      funcType, llvm::Function::ExternalLinkage, "add", module.get());

  auto argIt = addFunc->arg_begin();
  llvm::Argument *argA = &*argIt;
  argA->setName("a");
  llvm::Argument *argB = &*(++argIt);
  argB->setName("b");

  llvm::BasicBlock *entryBB =
      llvm::BasicBlock::Create(*context, "entry", addFunc);
  builder.SetInsertPoint(entryBB);

  llvm::Value *sum = builder.CreateAdd(argA, argB);
  builder.CreateRet(sum);

  return llvm::orc::ThreadSafeModule(std::move(module), std::move(context));
}

int main(int argc, char *argv[]) {
  llvm::InitLLVM init(argc, argv);
  llvm::InitializeNativeTarget();
  llvm::InitializeNativeTargetAsmPrinter();

  auto jitExp = llvm::orc::LLJITBuilder().create();
  if (!jitExp) {
    llvm::errs() << "Error creating JIT: " << llvm::toString(jitExp.takeError())
                 << "\n";
    return 1;
  }
  auto jit = std::move(*jitExp);

  auto module = createAddModule();
  if (auto err = jit->addIRModule(std::move(module))) {
    llvm::errs() << "Error adding module: " << llvm::toString(std::move(err))
                 << "\n";
    return 1;
  }

  auto symExp = jit->lookup("add");
  if (!symExp) {
    llvm::errs() << "Error looking up: " << llvm::toString(symExp.takeError())
                 << "\n";
    return 1;
  }

  using AddFuncPtr = int (*)(int, int);
  auto add = symExp->toPtr<AddFuncPtr>();

  int a = 1;
  int b = 2;
  int result = add(a, b);

  std::cout << "[JIT Result] " << a << " + " << b << " = " << result
            << std::endl;

  return 0;
}
```

コンパイル:

```
% /opt/homebrew/opt/llvm/bin/clang++ -std=c++17 add.cpp $(/opt/homebrew/opt/llvm/bin/llvm-config --cxxflags --ldflags --system-libs --libs core orcjit native)
```

何事もなければ、足し算結果が出力される。これは、C++ネイティブではなくJIT実行された結果である:

```
% ./a.out 
[JIT Result] 1 + 2 = 3
```

## LLVM JITでフィボナッチ数列

```cpp
int fib(int n) {
  if (n <= 1) {
    return n;
  }
  return nativeFib(n - 1) + nativeFib(n - 2);
}
```

分岐があるので、基本ブロックに分解し、$\phi$関数に相当する`llvm::PHINode`で、値を合流させる。

```cpp
#include <llvm/ExecutionEngine/Orc/LLJIT.h>
#include <llvm/IR/IRBuilder.h>
#include <llvm/IR/LLVMContext.h>
#include <llvm/IR/Module.h>
#include <llvm/Support/InitLLVM.h>
#include <llvm/Support/TargetSelect.h>
#include <llvm/Support/raw_ostream.h>

#include <iostream>
#include <memory>

llvm::orc::ThreadSafeModule createFibModule() {
  auto context = std::make_unique<llvm::LLVMContext>();
  auto module = std::make_unique<llvm::Module>("module", *context);
  llvm::IRBuilder<> builder(*context);

  llvm::Type *i32Type = builder.getInt32Ty();
  llvm::FunctionType *funcType =
      llvm::FunctionType::get(i32Type, {i32Type}, false);

  llvm::Function *fibFunc = llvm::Function::Create(
      funcType, llvm::Function::ExternalLinkage, "fib", module.get());

  llvm::Argument *argN = &*fibFunc->arg_begin();
  argN->setName("n");

  llvm::BasicBlock *entryBB =
      llvm::BasicBlock::Create(*context, "entry", fibFunc);
  llvm::BasicBlock *recurseBB =
      llvm::BasicBlock::Create(*context, "recurse", fibFunc);
  llvm::BasicBlock *returnBB =
      llvm::BasicBlock::Create(*context, "return", fibFunc);

  builder.SetInsertPoint(entryBB);
  llvm::Value *cond = builder.CreateICmpSLE(argN, builder.getInt32(1), "cond");
  builder.CreateCondBr(cond, returnBB, recurseBB);

  builder.SetInsertPoint(returnBB);
  llvm::PHINode *varM = builder.CreatePHI(i32Type, 2, "m");
  varM->addIncoming(argN, entryBB);
  builder.CreateRet(varM);

  builder.SetInsertPoint(recurseBB);
  llvm::Value *sub1 = builder.CreateSub(argN, builder.getInt32(1));
  llvm::Value *call1 = builder.CreateCall(fibFunc, {sub1}, "call1");
  llvm::Value *sub2 = builder.CreateSub(argN, builder.getInt32(2));
  llvm::Value *call2 = builder.CreateCall(fibFunc, {sub2}, "call2");
  llvm::Value *sum = builder.CreateAdd(call1, call2, "sum");
  varM->addIncoming(sum, recurseBB);
  builder.CreateBr(returnBB);

  return llvm::orc::ThreadSafeModule(std::move(module), std::move(context));
}

int main(int argc, char *argv[]) {
  llvm::InitLLVM init(argc, argv);
  llvm::InitializeNativeTarget();
  llvm::InitializeNativeTargetAsmPrinter();

  auto jitExp = llvm::orc::LLJITBuilder().create();
  if (!jitExp) {
    llvm::errs() << "Error creating JIT: " << llvm::toString(jitExp.takeError())
                 << "\n";
    return 1;
  }
  auto jit = std::move(*jitExp);

  auto module = createFibModule();
  if (auto err = jit->addIRModule(std::move(module))) {
    llvm::errs() << "Error adding module: " << llvm::toString(std::move(err))
                 << "\n";
    return 1;
  }

  auto symExp = jit->lookup("fib");
  if (!symExp) {
    llvm::errs() << "Error looking up: " << llvm::toString(symExp.takeError())
                 << "\n";
    return 1;
  }

  using FibFuncPtr = int (*)(int);
  auto fib = symExp->toPtr<FibFuncPtr>();

  int n = 42;
  int result = fib(n);

  std::cout << "[JIT Result] fib(" << n << ") = " << result << std::endl;

  return 0;
}
```

出力:

```
% /opt/homebrew/opt/llvm/bin/clang++ -std=c++17 fib.cpp $(/opt/homebrew/opt/llvm/bin/llvm-config --cxxflags --ldflags --system-libs --libs core orcjit native)   
% ./a.out
[JIT Result] fib(42) = 267914296
```

## 参考

- [JIT Design and Implementation · The Julia Language](https://docs.julialang.org/en/v1/devdocs/jit/)
- [ORC Design and Implementation - LLVM](https://llvm.org/docs/ORCv2.html)