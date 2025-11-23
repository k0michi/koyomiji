# ABC 396 D - Minimum XOR Path

- 問題: https://atcoder.jp/contests/abc396/tasks/abc396_d
- $N$が小さいので、$O(N!N)$で経路を列挙すれば間に合う
- `next_permutation`で中継地点の順番を列挙して、`for`で最初から何個の中継地点を通るかを列挙する実装にした
  - でもDFSの方が楽そう

```cpp
void answer() {
  llong N, M;
  read(N, M);
  std::vector<std::vector<llong>> matrix(N, std::vector<llong>(N, -1));

  for (llong i = 0; i < M; i++) {
    llong u_i, v_i, w_i;
    read(u_i, v_i, w_i);

    u_i--;
    v_i--;

    matrix[u_i][v_i] = w_i;
    matrix[v_i][u_i] = w_i;
  }

  std::vector<llong> path(N);
  std::iota(path.begin(), path.end(), 0);
  llong min = std::numeric_limits<llong>::max();

  do {
    llong v = 0;

    for (llong i = 0; i < N; i++) {
      if (i - 1 >= 0) {
        if (matrix[path[i - 1]][path[i]] == -1) {
          break;
        }

        v ^= matrix[path[i - 1]][path[i]];
      }

      if (matrix[path[i]][N - 1] != -1) {
        min = std::min(min, v ^ matrix[path[i]][N - 1]);
      }
    }
  } while (std::next_permutation(++path.begin(), --path.end()));

  writeln(min);
}
```

- 提出: https://atcoder.jp/contests/abc396/tasks/abc396_d