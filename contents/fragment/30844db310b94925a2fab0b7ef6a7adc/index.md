# C言語のenumの大きさは（デフォルトでは）不定

- 次のようなenumを考える。この出力はどうなるだろうか:
  ```c:example.c
  #include <stdio.h>

  typedef enum Theme {
    LIGHT,
    DARK,
    SYSTEM_DEFAULT,
  } Theme;

  int main() {
    printf("sizeof(Theme) = %zu\n", sizeof(Theme));
    return 0;
  }
  ```
- Apple clang (21.0.0)でオプションを与えずにコンパイルして実行すると
  ```
  % clang example.c
  % ./a.out 
  sizeof(Theme) = 4
  ```
  - `int`と同じサイズとなる
- しかし、C23の時点で、enumの型が明示されていない場合、その大きさに関しては具体的な指定がない
  - [N3096](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf) p126
    > All enumerations have an *underlying type*. The underlying type can be explicitly specified using an enum type specifier and is its *fixed underlying type*. If it is not explicitly specified, the underlying type is the enumeration’s compatible type, which is either `char` or a standard or extended signed or unsigned integer type.
- 例えば、clangでは`-fshort-enums`オプションを付与すると、enumのサイズを強制的に小さくできる。C言語の仕様では、このような挙動は許可されている:
  ```
  % clang example.c -fshort-enums
  % ./a.out
  sizeof(Theme) = 1
  ```
- enumのサイズを固定するために、`0x7FFFFFFF`のような`char`や`short`では表現できないメンバを加え、強制的にenumの大きさを`int32_t`相当にするテクニックがある
  - 例えば
    ```c
    typedef enum Theme {
      LIGHT,
      DARK,
      SYSTEM_DEFAULT,
      FORCE32 = 0x7FFFFFFF,
    } Theme;
    ```
    とすると、
    ```
    % clang example.c -fshort-enums
    % ./a.out
    sizeof(Theme) = 4
    ```
  - `webgpu.h`などで見られる:
    - https://github.com/webgpu-native/webgpu-headers/blob/bf8ddb91dc38ea11ec1b727dae1fa965c4207d22/webgpu.h#L388
- なお、C23ではenumに明示的に型を指定することができる:
  ```c
  typedef enum Theme : int {
    LIGHT,
    DARK,
    SYSTEM_DEFAULT,
  } Theme;
  ```
  - この場合、enumの大きさは`-fshort-enums`の影響を受けない:
    ```
    % clang example.c -fshort-enums
    % ./a.out 
    sizeof(Theme) = 4
    ```
  - ただし、当然ながらC23対応のコンパイラが必要となる