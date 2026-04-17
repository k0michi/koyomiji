# ABC 401 D - Logical Filling

- 問題: https://atcoder.jp/contests/abc401/tasks/abc401_d
- まず、`o`の隣の`?`は`.`で確定できる
- $S$に$K$個の`o`がすでにある場合は、すべての`?`は`.`で確定できる
- $S$の`o`の個数が$K-1$個以下の場合
  - $S$が奇数長で`?`からなる、例えば`???`であり、$K=(N+1)/2$であるなら`o.o`というふうに確定できる
  - $S$が偶数長で`?`からなる、例えば`????`のときは、$K$をどのように取っても、`o`の位置を確定できない
    - ただし、$K=0$の場合は先ほどの考察から`....`に確定できる
  - この考察を、`?`を部分文字列として持つ$S$に適用すると
    - 「奇数長の`?`のみからなる部分文字列」では`o`が$(N+1)/2$回出現し、かつ、
    - 「偶数長の`?`のみからなる部分文字列」では`o`が$N/2$回出現し、かつ、
    - `?`中の`o`と元からある`o`の個数の合計が$K$に一致するならば
    - 「奇数長の`?`のみからなる部分文字列」における`o`と`.`の位置を確定できる
      - 「偶数長の`?`のみからなる部分文字列」は`o`を消費するだけで、`?`の確定はできない

```cpp
void answer() {
  llong N, K;
  std::string S;
  read(N, K, S);

  for (llong i = 0; i < N; i++) {
    if (S[i] == '?') {
      if (i - 1 >= 0 && S[i - 1] == 'o' || i + 1 < N && S[i + 1] == 'o') {
        S[i] = '.';
      }
    }
  }

  llong oCount = 0;

  for (llong i = 0; i < N; i++) {
    oCount += S[i] == 'o';
  }

  if (oCount == K) {
    for (llong i = 0; i < N; i++) {
      if (S[i] == '?') {
        S[i] = '.';
      }
    }
  }

  std::string SCopy = S;
  llong begin = -1;

  for (llong i = 0; i <= N; i++) {
    if (i < N && S[i] == '?') {
      if (begin == -1) {
        begin = i;
      }
    } else if (begin != -1) {
      if ((i - begin) % 2 == 0) {
        K -= (i - begin) / 2;
      } else {
        for (llong j = begin; j < i; j++) {
          S[j] = (j - begin) % 2 == 0 ? 'o' : '.';
        }

        K -= (i - begin + 1) / 2;
      }

      begin = -1;
    }

    K -= i < N && S[i] == 'o';
  }

  writeln(K == 0 ? S : SCopy);
}
```

- 提出: https://atcoder.jp/contests/abc401/submissions/75007870