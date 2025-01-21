# \<cstdint>のリテラルをなんとかしたい【C++】

C++の`<cstdint>`は、`int32_t`などといった、プラットフォームに依らず、固定長の幅を持つ整数を別名定義しています。このヘッダを用いることで、移植性の高いプログラムを記述できるようになるので、よほどの理由がない限りは`int`などを直接使うよりも、これらの型を利用した方がいいのですが、この`<cstdint>`にはとある問題があります。

この問題というのが、`int32_t`などのリテラルを表現する簡単な方法が用意されていないことです。具体的な例を挙げると、型が`int8_t`であるような定数`0`を表現するのに、`static_cast<std::int8_t>(0)`のように書く必要があります。単に`0`と書いてしまうと、これでは`int`型になってしまうので、明示的なキャストを行う必要があるのです。`static_cast`の代わりに関数スタイルのキャストを用いて`std::int8_t(0)`のように書くこともできますが、どちらにせよ毎回定数をこのように書くのは面倒です。

`intN_t`であるようなリテラルを簡単に記述できないと困るのは、具体的には次のような場面です。

1. 右辺の値を`auto`で受けたいとき。明示的なキャストをしないと、変数の型が`int`として推論されてしまいます。
   ```cpp
   auto x = std::int8_t(0);
   ```
2. `std::max`のような、型`T`が引数から推論されるテンプレート関数で、複数の`T`を引数にとる関数を呼び出すとき。引数の型が一致しないと型推論が行えずエラーになります。
   ```cpp
   std::int64_t y = -1;
   // int64_tがlongまたはlong longの別名であるとき、std::max(y, 0);はエラー
   auto z = std::max(y, std::int64_t(0));
   ```
3. 整数の型によってオーバーロードされている関数を呼び出したいとき。
   ```cpp
   void f(std::int32_t x) {}
   void f(std::uint32_t x) {}

   void main() {
     f(std::uint32_t(0));
   }
   ```

`intN_t`のリテラルをもっと簡単に書く方法はないのでしょうか。

幸いにも、C++11以降には[ユーザー定義リテラル](https://cpprefjp.github.io/lang/cpp11/user_defined_literals.html)があります。次のようにユーザー定義リテラルを定義します:

```cpp
#include <cstdint>

#ifdef INT8_MAX
constexpr inline std::int8_t operator""_i8(unsigned long long x) {
  return static_cast<std::int8_t>(x);
}
#endif

#ifdef UINT8_MAX
constexpr inline std::uint8_t operator""_u8(unsigned long long x) {
  return static_cast<std::uint8_t>(x);
}
#endif

#ifdef INT16_MAX
constexpr inline std::int16_t operator""_i16(unsigned long long x) {
  return static_cast<std::int16_t>(x);
}
#endif

#ifdef UINT16_MAX
constexpr inline std::uint16_t operator""_u16(unsigned long long x) {
  return static_cast<std::uint16_t>(x);
}
#endif

#ifdef INT32_MAX
constexpr inline std::int32_t operator""_i32(unsigned long long x) {
  return static_cast<std::int32_t>(x);
}
#endif

#ifdef UINT32_MAX
constexpr inline std::uint32_t operator""_u32(unsigned long long x) {
  return static_cast<std::uint32_t>(x);
}
#endif

#ifdef INT64_MAX
constexpr inline std::int64_t operator""_i64(unsigned long long x) {
  return static_cast<std::int64_t>(x);
}
#endif

#ifdef UINT64_MAX
constexpr inline std::uint64_t operator""_u64(unsigned long long x) {
  return static_cast<std::uint64_t>(x);
}
#endif

constexpr inline std::int_fast8_t operator""_if8(unsigned long long x) {
  return static_cast<std::int_fast8_t>(x);
}

constexpr inline std::uint_fast8_t operator""_uf8(unsigned long long x) {
  return static_cast<std::uint_fast8_t>(x);
}

constexpr inline std::int_fast16_t operator""_if16(unsigned long long x) {
  return static_cast<std::int_fast16_t>(x);
}

constexpr inline std::uint_fast16_t operator""_uf16(unsigned long long x) {
  return static_cast<std::uint_fast16_t>(x);
}

constexpr inline std::int_fast32_t operator""_if32(unsigned long long x) {
  return static_cast<std::int_fast32_t>(x);
}

constexpr inline std::uint_fast32_t operator""_uf32(unsigned long long x) {
  return static_cast<std::uint_fast32_t>(x);
}

constexpr inline std::int_fast64_t operator""_if64(unsigned long long x) {
  return static_cast<std::int_fast64_t>(x);
}

constexpr inline std::uint_fast64_t operator""_uf64(unsigned long long x) {
  return static_cast<std::uint_fast64_t>(x);
}

constexpr inline std::int_least8_t operator""_il8(unsigned long long x) {
  return static_cast<std::int_least8_t>(x);
}

constexpr inline std::uint_least8_t operator""_ul8(unsigned long long x) {
  return static_cast<std::uint_least8_t>(x);
}

constexpr inline std::int_least16_t operator""_il16(unsigned long long x) {
  return static_cast<std::int_least16_t>(x);
}

constexpr inline std::uint_least16_t operator""_ul16(unsigned long long x) {
  return static_cast<std::uint_least16_t>(x);
}

constexpr inline std::int_least32_t operator""_il32(unsigned long long x) {
  return static_cast<std::int_least32_t>(x);
}

constexpr inline std::uint_least32_t operator""_ul32(unsigned long long x) {
  return static_cast<std::uint_least32_t>(x);
}

constexpr inline std::int_least64_t operator""_il64(unsigned long long x) {
  return static_cast<std::int_least64_t>(x);
}

constexpr inline std::uint_least64_t operator""_ul64(unsigned long long x) {
  return static_cast<std::uint_least64_t>(x);
}
```

このようにリテラルを定義することによって、`intN_t`のリテラルを`0_iN`のように記述できるようになります。`int_leastN_t`、`int_fastN_t`に関しても同様に`0_ilN`、`0_ifN`とできます。`intN_t`に関しては、`N`ビットちょうどの整数がない環境では定義されないので、`INTN_MAX`が定義されているかによって`#ifdef`しています。

先ほどの例を、これらのリテラルを用いて書き直すとこうなります:

```cpp
auto x = 0_i8;

auto y = -1_i64;
auto z = std::min(y, 0_i64);

f(0_u32);
```

余談ですが、`<cstdint>`には`INT32_C(n)`といった定数値マクロが用意されています。[N3096](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf)によると、`INTN_C(value)`は`int_leastN_t`に対応する(corresponding)整数定数式になる、とあります。しかしながら、これらのマクロはあくまでC向けのようで、`auto x = INT8_C(0);`としたとき`x`が`int_least8_t`にならなかったりします(少なくとも手元のAppleClang 16.0.0では、単に末尾に`U`や`LL`を付与するのみで、キャストは行われない)。