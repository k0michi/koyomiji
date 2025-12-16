# C99の複合リテラルはC++にはない

- C++を書いていたら、GitHub Copilotが関数の引数として
  ```c
  &(int){1}
  ```
  という見慣れない構文を提案してきた
- `(int){1}`はC99の複合リテラル（Compound literal）というやつらしい。複合リテラルはlvalueなので、`&`でアドレスを取れる
  - [Compound literals (since C99) - cppreference.com](https://en.cppreference.com/w/c/language/compound_literal.html)
- しかし複合リテラルはC++には存在していない
  - [c++14 - Are compound literals Standard C++? - Stack Overflow](https://stackoverflow.com/questions/28116467/are-compound-literals-standard-c)
- 例えば
  ```c
  void f(int *x) {}

  int main() {
    f(&(int){42});
    return 0;
  }
  ```
  は、`clang` (AppleClang 16.0.0)では何も言われないが`clang++`でコンパイルすると、次のエラーになる:
  ```
  src/main.cc:4:5: error: cannot take the address of an rvalue of type 'int'
      4 |   f(&(int){42});
        |
  ```
- GCCでは拡張としてC++中でも複合リテラルを使うことができるようだ
  - [Compound Literals (Using the GNU Compiler Collection (GCC))](https://gcc.gnu.org/onlinedocs/gcc/Compound-Literals.html)