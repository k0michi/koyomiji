# ABC 402 C - Dislike Foods

- 問題: https://atcoder.jp/contests/abc402/tasks/abc402_c
- 食材から、それが含まれる料理全てへのマップをあらかじめ計算して、苦手ではなくなった食材を消していくというアプローチ
- 時間計算量が$O(N\times (\text{食材}B_i{を含む料理の個数の最大}))$なので、時間超過することを懸念した
  - しかし「$K_i$の総和は$3\times 10^5$以下」の制約がある
  - このため最悪ケースになりそうなのは
    - $N=M=3\times 10^5,K_1=K_2=\dots=1$の場合
    - $N=3\times 10^5,M=K_1=K_2=\dots=\sqrt{3\times 10^5}$の場合
  - だが、いずれにしても$10^8$を超えないので問題なさそうと判断

```cpp
void answer() {
  llong N, M;
  read(N, M);

  std::vector<std::unordered_set<llong>> ings(M);
  std::vector<std::unordered_set<llong>> toDishes(N);

  for (llong i = 0; i < M; i++) {
    llong K_i;
    read(K_i);

    for (llong j = 0; j < K_i; j++) {
      llong A_ij;
      read(A_ij);
      A_ij--;

      ings[i].insert(A_ij);
      toDishes[A_ij].insert(i);
    }
  }

  llong count = 0;

  for (llong i = 0; i < N; i++) {
    llong B_i;
    read(B_i);
    B_i--;

    for (auto d : toDishes[B_i]) {
      ings[d].erase(B_i);
      count += ings[d].size() == 0;
    }

    writeln(count);
  }
}
```

- 提出: https://atcoder.jp/contests/abc402/submissions/75024988