# ABC 455 D - Card Pile Query

- 問題: https://atcoder.jp/contests/abc455/tasks/abc455_d
- グラフのエッジの付け替えのように考える
  - つまり、カードがノード、積まれているカード同士がエッジで繋がれているように考える
  - 便宜上、カードの山をそれぞれ$-1,\dots,-N$で表現する。接続先がないときは$0$とする
  - 各クエリに対して$O(1)$の操作でエッジを付け替え、最後に$-1,\dots,-N$からの連結成分の個数を回答する


```cpp
void answer() {
  llong N, Q;
  read(N, Q);

  std::unordered_map<llong, llong> nexts;
  std::unordered_map<llong, llong> prevs;

  for (llong i = 1; i <= N; i++) {
    nexts[-i] = i;
    prevs[i] = -i;
  }

  for (llong i = 0; i < Q; i++) {
    llong C_i, P_i;
    read(C_i, P_i);

    nexts[prevs[C_i]] = 0;
    prevs[C_i] = P_i;
    nexts[P_i] = C_i;
  }

  std::vector<llong> piles(N);

  for (llong i = 1; i <= N; i++) {
    llong c = nexts[-i];

    while (c != 0) {
      piles[i - 1]++;
      c = nexts[c];
    }
  }

  writeln(piles);
}
```

- 提出: https://atcoder.jp/contests/abc455/submissions/75499150