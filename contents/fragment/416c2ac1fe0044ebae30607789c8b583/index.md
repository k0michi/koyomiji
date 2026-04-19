# ABC 452 E - You WILL Like Sigma Problem

- 問題: https://atcoder.jp/contests/abc452/tasks/abc452_e
- $i\bmod j=i-j\left\lfloor \frac{i}{j} \right\rfloor$であることを用いて、以下のように式変形する
  $$
  \begin{aligned}
  \sum_{i=1}^N\sum_{j=1}^M A_i B_j(i\bmod j)&=\sum_{i=1}^N\sum_{j=1}^M A_i B_j \left(i-j\left\lfloor \frac{i}{j} \right\rfloor\right)\\
  &=\sum_{i=1}^N\sum_{j=1}^M A_iB_ji-\sum_{i=1}^N\sum_{j=1}^M A_iB_jj\left\lfloor \frac{i}{j} \right\rfloor\\
  &=\sum_{i=1}^N \left(A_ii \sum_{j=1}^M B_j\right)-\sum_{j=1}^N\left(B_jj \sum_{i=1}^NA_i \left\lfloor \frac{i}{j} \right\rfloor\right)\\
  &=\left( \sum_{i=1}^N A_ii \right)\left(\sum_{j=1}^M B_j\right)-\sum_{j=1}^N\left(B_jj \sum_{i=1}^NA_i \left\lfloor \frac{i}{j} \right\rfloor\right)\\
  \end{aligned}
  $$
- 左辺は単に総和同士の積を取れば良い
- 右辺の$\sum_{i=1}^NA_i\left\lfloor \frac{i}{j} \right\rfloor$の部分の高速化を考える
  - $\left\lfloor \frac{i}{j} \right\rfloor$は$i$が$j$増えるごとに1増える関係にある
  - ![](./Screenshot%202026-04-19%20at%2021.08.28.png)
  - このことを使うと
    $$
    \sum_{i=1}^NA_i\left\lfloor \frac{i}{j} \right\rfloor=0\times \sum_{i=1}^{j-1}A_i+1\times\sum_{i=j}^{2j-1} A_i+\cdots
    $$
    と計算できる。これは、累積和を用いると、これは$O(N/j)$で求めることができる
- 時間計算量は、$\sum_{i=1}^N \frac{N}{j}=N\sum_{i=1}^N\frac{1}{j}$に対して調和級数の和を用いることで、$O(N\log N)$と評価できる

```cpp
void answer() {
  llong N, M;
  read(N, M);

  std::vector<llong> A(N);
  std::vector<llong> B(M);
  read(A, B);

  std::vector<llong> cumu(N + 1);

  for (llong i = 0; i < N; i++) {
    cumu[i + 1] = cumu[i] + A[i];
  }

  ModInt998244353 result = 0;

  {
    ModInt998244353 temp = 0;

    for (llong i = 0; i < N; i++) {
      temp += A[i] * (i + 1);
    }

    result += temp * std::reduce(B.begin(), B.end());
  }

  for (llong j = 0; j < M; j++) {
    ModInt998244353 temp = 0;
    temp += (cumu[std::min(j, N)] - cumu[0]) * ((1) / (j + 1));

    for (llong i = j; i < N; i += j + 1) {
      temp += (cumu[std::min(i + j + 1, N)] - cumu[i]) * ((i + 1) / (j + 1));
    }

    result -= temp * B[j] * (j + 1);
  }

  writeln(result);
}
```

- 提出: https://atcoder.jp/contests/abc452/submissions/75110067