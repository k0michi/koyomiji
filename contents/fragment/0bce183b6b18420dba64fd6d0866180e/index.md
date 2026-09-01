# C++20で加算・乗算オーバーフローチェック

- LeetCodeの[7. Reverse Integer](https://leetcode.com/problems/reverse-integer/description/)をC++で解こうとしたらハマったのでメモ
- この問題では加算・乗算がオーバーフローして`int32_t`に収まらないならば`0`を返す必要がある
  - 64ビットを使えば簡単だが、使わずにやるのが問題の趣旨
- Rustなら、オーバーフローを考慮した演算を行うライブラリが揃っており、これだけでOK:
  ```rust
  impl Solution {
      pub fn reverse(mut x: i32) -> i32 {
          let mut r: i32 = 0;

          while (x != 0) {
              match r.checked_mul(10).and_then(|v| v.checked_add(x % 10)) {
                  Some(v) => r = v,
                  None => return 0,
              }
              x /= 10;
          }
          
          r
      }
  }
  ```
- しかしC++には加算・乗算オーバーフローをチェックする標準ライブラリが用意されていないため、この判定を自作する必要がある
- 注意点として、C++17以前では整数が2の補数表現であることが仕様で保証されていない。今回はC++20を対象としており、2の補数表現である前提
- Rustの`overflowing_add`, `overflowing_mul`のC++20版をGemini/Codexで実装。ついでに`signed`, `unsigned`混合の演算にも対応
  - `overflowingAdd`: Rust同様、ラップした加算結果と、加算オーバーフローの有無を`pair`で返す。`left`と`right`を`unsigned`経由で加算する。加算結果と`left`の差の正負が、`right`と一致していないならオーバーフローしていると判定する
  - `overflowingMul`: ラップした乗算結果と、乗算オーバーフローの有無を`pair`で返す。`max()`を`right`で割って、乗算結果が最大値を超えるならオーバーフローと判定する
    - 割り算があるので、頻繁に呼ぶと定数倍で遅くなる可能性があることに注意
    - `absDiff`: Rustの`abs_diff`の移植。`unsigned`で結果を返す`abs`。オーバーフローは起きない
  ```cpp
  template <std::integral T>
    requires(!std::same_as<std::remove_cv_t<T>, bool>)
  [[nodiscard]] constexpr std::make_unsigned_t<T> absDiff(T left,
                                                          T right) noexcept {
    using U = std::make_unsigned_t<T>;
    U leftBits = static_cast<U>(left);
    U rightBits = static_cast<U>(right);
    return left < right ? rightBits - leftBits : leftBits - rightBits;
  }

  template <std::integral T, std::integral U>
    requires(!std::same_as<std::remove_cv_t<T>, bool> &&
            !std::same_as<std::remove_cv_t<U>, bool> &&
            (std::same_as<T, U> || std::same_as<U, std::make_unsigned_t<T>> ||
              std::same_as<U, std::make_signed_t<T>>))
  [[nodiscard]] constexpr std::pair<T, bool> overflowingAdd(T left,
                                                            U right) noexcept {
    using Unsigned = std::make_unsigned_t<T>;
    const Unsigned bits =
        static_cast<Unsigned>(left) + static_cast<Unsigned>(right);
    const T result = static_cast<T>(bits);
    const bool isNegative = std::is_signed_v<U> && right < 0;
    return {result, (result < left) != isNegative};
  }

  template <std::integral T, std::integral U>
    requires(!std::same_as<std::remove_cv_t<T>, bool> &&
            !std::same_as<std::remove_cv_t<U>, bool> &&
            (std::same_as<T, U> || std::same_as<U, std::make_unsigned_t<T>> ||
              std::same_as<U, std::make_signed_t<T>>))
  [[nodiscard]] constexpr std::pair<T, bool> overflowingMul(T left,
                                                            U right) noexcept {
    using Unsigned = std::make_unsigned_t<T>;
    Unsigned bits =
        static_cast<Unsigned>(left) * static_cast<Unsigned>(right);
    T result = static_cast<T>(bits);
    if constexpr (std::unsigned_integral<T> && std::unsigned_integral<U>) {
      return {result,
              right != 0 && left > std::numeric_limits<T>::max() / right};
    } else {
      Unsigned leftMagnitude = absDiff(left, T{});
      Unsigned rightMagnitude = absDiff(right, U{});
      if (leftMagnitude == 0 || rightMagnitude == 0) {
        return {result, false};
      }
      bool leftNegative = std::is_signed_v<T> && left < 0;
      bool rightNegative = std::is_signed_v<U> && right < 0;
      bool negative = leftNegative != rightNegative;
      if constexpr (std::unsigned_integral<T>) {
        if (negative) {
          return {result, true};
        }
        return {result,
                leftMagnitude >
                    std::numeric_limits<T>::max() / rightMagnitude};
      } else {
        Unsigned limit = static_cast<Unsigned>(std::numeric_limits<T>::max()) +
                        Unsigned{negative};
        return {result, leftMagnitude > limit / rightMagnitude};
      }
    }
  }

  class Solution {
  public:
      int reverse(int x) {
          int r = 0;

          while (x != 0) {
              auto res = overflowingMul(r, 10);

              if (res.second) {
                  return 0;
              }

              res = overflowingAdd(res.first, x % 10);

              if (res.second) {
                  return 0;
              }

              r = res.first;
              x /= 10;
          }

          return r;
      }
  };
  ```