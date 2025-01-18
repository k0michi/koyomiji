# まだSegmentation faultで消耗してるの？

うちの大学で聞き耳を立てていると、Segmentation fault云々の話をよく聞く。特に、C言語やアルゴリズムの授業が開講されるこの時期に。一応、授業でデバッガ(gdb)の使い方を教わった気はするけれど、そんなハイカラなものを使いこなせる学生はそう多くない。大体の学生は、単に`gcc program.c && ./a.out`のようにしてデバッグをしていると思う。結果として、`Segmentation fault (core dumped)`とかいう、飾り気のないエラー文に悩まされることとなる。あるいは何のエラーもないまま、C/C++の理解不能な未定義動作に苦しめられることになる。

もちろん、gdbなどを使ってデバッグするというのも一つの手ではある。だが、gccやclangには**サニタイザー**と呼ばれる、ランタイムにこれらの過ちを検出できる機能がある。また、警告レベルを最大にすることで、C/C++の古き悪き仕様に嵌っているであろうコードに対して警告を出すことができる。

これらの機能は、単にコンパイラオプションを渡すだけで有効にすることができる。またこれらのオプションは、gccでもclangでも利用できる:

- `-fsanitize=undefined,address`: 未定義動作および範囲外アドレスに対するサニタイズを有効にする
- `-Wall`: 全ての警告を有効にする

サニタイザーオプションはこの他にもあるが、gccとclangで異なっていたり、同時に有効にできない組み合わせがあったりする。

## 実行例

次のプログラムをコンパイル、実行してみる。使用したコンパイラはAppleClang 15.0.0。

```c
#include <stdio.h>

int main(void) {
  int array[2] = {0, 1};

  for (int i; i < 3; i++) {
    printf("%d\n", array[i]);
  }

  return 0;
}
```

前述のオプションを指定してコンパイルすると、`i`が初期化されていないことを警告してくれる:

```
$ gcc -fsanitize=undefined,address -Wall program.c
program.c:6:15: warning: variable 'i' is uninitialized when used here [-Wuninitialized]
  for (int i; i < 3; i++) {
              ^
program.c:6:13: note: initialize the variable 'i' to silence this warning
  for (int i; i < 3; i++) {
            ^
             = 0
1 warning generated.
```

また、実行時エラーも次のように教えてくれる。program.cの7行目20列で、配列に対する範囲外アクセスが起きていることがすぐにわかる:

```
$ ./a.out
0
1
program.c:7:20: runtime error: index 2 out of bounds for type 'int[2]'
SUMMARY: UndefinedBehaviorSanitizer: undefined-behavior program.c:7:20 in 
=================================================================
==79100==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x00016f7c2c48 at pc 0x00010063fb7c bp 0x00016f7c2c10 sp 0x00016f7c2c08
READ of size 4 at 0x00016f7c2c48 thread T0
    #0 0x10063fb78 in main+0x300 (a.out:arm64+0x100003b78)
    #1 0x188a68270  (<unknown module>)

Address 0x00016f7c2c48 is located in stack of thread T0 at offset 40 in frame
    #0 0x10063f884 in main+0xc (a.out:arm64+0x100003884)

  This frame has 1 object(s):
    [32, 40) 'array' <== Memory access at offset 40 overflows this variable
HINT: this may be a false positive if your program uses some custom stack unwind mechanism, swapcontext or vfork
      (longjmp and C++ exceptions *are* supported)
SUMMARY: AddressSanitizer: stack-buffer-overflow (a.out:arm64+0x100003b78) in main+0x300
Shadow bytes around the buggy address:
  0x00016f7c2980: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x00016f7c2a00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x00016f7c2a80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x00016f7c2b00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x00016f7c2b80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x00016f7c2c00: 00 00 00 00 f1 f1 f1 f1 00[f3]f3 f3 00 00 00 00
  0x00016f7c2c80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x00016f7c2d00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x00016f7c2d80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x00016f7c2e00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x00016f7c2e80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07 
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
==79100==ABORTING
```