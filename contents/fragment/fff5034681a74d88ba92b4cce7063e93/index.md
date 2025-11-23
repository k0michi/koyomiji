# ABC 404 C - Cycle Graph?

- 問題: https://atcoder.jp/contests/abc404/tasks/abc404_c
- $G$はサイクルグラフ $\iff$ $G$は連結かつ全ての頂点の次数が2 が成り立つ、という仮説で書いたらあってたっぽい

```cpp
std::vector<llong> visited;
std::vector<std::vector<llong>> edges;

void search(llong v) {
  if (!visited[v]) {
    visited[v] = true;

    for (auto &&u : edges[v]) {
      search(u);
    }
  }
}

void answer() {
  llong N, M;
  read(N, M);
  edges.resize(N);

  for (llong i = 0; i < M; i++) {
    llong A_i, B_i;
    read(A_i, B_i);
    A_i--, B_i--;
    edges[A_i].push_back(B_i);
    edges[B_i].push_back(A_i);
  }

  visited.resize(N);
  search(0);

  llong result = true;

  for (llong i = 0; i < N; i++) {
    result = result && (visited[i] && edges[i].size() == 2);
  }

  writeln(result ? "Yes" : "No");
}
```

- 提出: https://atcoder.jp/contests/abc404/submissions/71189316