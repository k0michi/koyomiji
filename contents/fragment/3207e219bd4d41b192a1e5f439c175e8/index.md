# ABC 402 D - Line Crossing

- 問題: https://atcoder.jp/contests/abc402/tasks/abc402_d
- $(A_i,B_i)$から、同じ傾きであれば同じ2点となるように線を平行移動し"正規化"した2点$(\hat A_i,\hat B_i)$を求め、その個数を今ある直線の個数から除外し加算する、という解法
  - 平行移動する先の2点はいくつかありうるが、円弧の中点が0に近い2点が選ばれるように正規化した
  - ![](./Screenshot%202026-04-17%20at%2021.31.50.png)
  - 想定解ではなさそう

```cpp
template <> struct std::hash<std::pair<llong, llong>> {
  size_t operator()(const std::pair<llong, llong> &p) const noexcept {
    return p.first * 31 + p.second;
  }
};

void answer() {
  llong N, M;
  read(N, M);

  llong lines = 0;
  std::unordered_map<std::pair<llong, llong>, llong> angleCounts;

  for (llong i = 0; i < M; i++) {
    llong A_i, B_i;
    read(A_i, B_i);

    B_i = ((A_i + B_i) / 2 % N) < ((A_i + B_i + N) / 2 % N) ? B_i : B_i + N;

    llong normA, normB;

    if ((A_i + B_i) % 2 == 0) {
      normA = (A_i + B_i) / 2 % N + 1;
      normB = (A_i + B_i) / 2 % N - 1;
    } else {
      normA = (A_i + B_i) / 2 % N;
      normB = (A_i + B_i) / 2 % N + 1;
    }

    lines += i - angleCounts[{normA, normB}];
    angleCounts[{normA, normB}]++;
  }

  writeln(lines);
}
```

- 提出: https://atcoder.jp/contests/abc402/submissions/75016446