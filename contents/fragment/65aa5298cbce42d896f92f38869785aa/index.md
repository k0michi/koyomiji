# ABC 408 C - Not All Covered

- 問題: https://atcoder.jp/contests/abc408/tasks/abc408_c
- imos法でできることはすぐわかったけど、書き方を忘れてた
- というか、Cでもimos法出るんだ

```cpp
void answer() {
  llong N, M;
  read(N, M);
  std::vector<llong> cumu(N);

  for (llong i = 0; i < M; i++) {
    llong L_i, R_i;
    read(L_i, R_i);
    cumu[L_i - 1]++;

    if (R_i < N) {
      cumu[R_i]--;
    }
  }

  llong min = cumu[0];

  for (llong i = 1; i < N; i++) {
    cumu[i] += cumu[i - 1];
    min = std::min(min, cumu[i]);
  }

  writeln(min);
}
```