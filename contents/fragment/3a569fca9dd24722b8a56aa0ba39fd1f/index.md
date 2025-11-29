# ABC 344 D - String Bags

- 問題: https://atcoder.jp/contests/abc344/tasks/abc344_d
- $dp[i][j] = j-1$ステップ目までで、文字列$T[0\dots i)$を構築するコスト、ただしできないなら$-1$ と定義
  - 各$i$について、$dp[i][0]=0$、それ以外は$-1$で初期化
  - $dp[i][j]$が$0$以上であるとき、$dp[i][j+1]$に追加コストなしで遷移可能
  - 各$k$について、$dp[i][j]$が$0$以上かつ、$T[i\dots i+|S_{j,k}|)=S_{j,k}$であるとき、$dp[i+|S_{j,k}|][j+1]$にコスト1で遷移可能
  - 答えは$dp[|T|,N]$

```cpp
void answer() {
  std::string T;
  llong N;
  read(T, N);
  std::vector<std::vector<std::string>> S(N);

  for (llong i = 0; i < N; i++) {
    llong A_i;
    read(A_i);
    S[i].resize(A_i);

    for (llong j = 0; j < A_i; j++) {
      read(S[i][j]);
    }
  }

  std::vector<std::vector<llong>> table(T.size() + 1,
                                        std::vector<llong>(N + 1, -1));

  for (llong i = 0; i < N + 1; i++) {
    table[0][i] = 0;
  }

  for (llong i = 0; i < T.size() + 1; i++) {
    for (llong j = 0; j < N; j++) {
      for (llong k = 0; k < S[j].size(); k++) {
        if (table[i][j] != -1) {
          if (i + S[j][k].size() < T.size() + 1 && j + 1 < N + 1) {
            if (T.substr(i).starts_with(S[j][k])) {
              if (table[i + S[j][k].size()][j + 1] == -1) {
                table[i + S[j][k].size()][j + 1] =
                    std::numeric_limits<llong>::max();
              }

              table[i + S[j][k].size()][j + 1] =
                  std::min(table[i + S[j][k].size()][j + 1], table[i][j] + 1);
            }
          }

          if (j + 1 < N + 1) {
            if (table[i][j + 1] == -1) {
              table[i][j + 1] = std::numeric_limits<llong>::max();
            }

            table[i][j + 1] = std::min(table[i][j + 1], table[i][j]);
          }
        }
      }
    }
  }

  writeln(table[T.size()][N]);
}
```

- 提出: https://atcoder.jp/contests/abc344/submissions/71294767