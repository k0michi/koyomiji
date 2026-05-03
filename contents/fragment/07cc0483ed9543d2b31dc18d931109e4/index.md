# ABC 456 C - Not Adjacent

- 問題: https://atcoder.jp/contests/abc456/tasks/abc456_c
- 同じ文字が連続している箇所、例えば`...aa...`を`...a`と`a...`という2つの部分文字列に分割して考える
  - `aa`を含むような部分文字列が条件を満たすことがないため
  - 同じ文字が連続している箇所で区切った部分文字列を$S_1,S_2,\dots,S_n$とすると、答えは$\sum_i {}_{|S_i|+1}C_2$

```cpp
template <typename T> T choose2(T n) { return n * (n - T(1)) / T(2); }

void answer() {
  std::string S;
  read(S);
  llong begin = 0;
  ModInt998244353 result;

  for (llong i = 0; i < S.size(); i++) {
    if (i - 1 >= 0) {
      if (S[i - 1] == S[i]) {
        result += choose2(i - begin + 1);
        begin = i;
      }
    }
  }

  result += choose2(S.size() - begin + 1);
  writeln(result);
}
```

- 提出: https://atcoder.jp/contests/abc456/submissions/75493622