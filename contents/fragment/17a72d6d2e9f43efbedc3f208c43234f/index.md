# 隣接行列から最小全域木を隣接リストとして構築するPrim法の実装

## 概要

- Prim法を用いて、与えられたグラフの最小全域木（MST）を構築する
- 計算量に影響しないため、最小全域木の重みの合計も同時に計算する
- 優先度付きキューを使わないバリエーションのPrim法

## 入力

- `llong nodeCount`: グラフの頂点数$V$
- `const AdjMatrix &matrix`: グラフの隣接行列。辺がない場合は`kInf`

## 出力

- `std::pair<AdjList, llong>`
  - `first`: MSTの隣接リスト
  - `second`: MSTの重みの合計

## 計算量

- 時間計算量: $O(V^2)$
- 空間計算量: $O(V^2)$

```cpp
using AdjList = std::vector<std::vector<std::pair<llong, llong>>>;
using AdjMatrix = std::vector<std::vector<llong>>;
constexpr llong kInf = 1e18;

std::pair<AdjList, llong> prim(llong nodeCount, const AdjMatrix &matrix) {
  AdjList mstMatrix(nodeCount);
  llong totalWeight = 0;
  std::vector<llong> minCost(nodeCount, kInf);
  std::vector<llong> parents(nodeCount, -1);
  std::vector<bool> used(nodeCount, false);

  minCost[0] = 0;

  for (llong i = 0; i < nodeCount; ++i) {
    llong u = -1;

    for (llong v = 0; v < nodeCount; ++v) {
      if (!used[v] && (u == -1 || minCost[v] < minCost[u])) {
        u = v;
      }
    }

    if (minCost[u] == kInf) {
      break;
    }

    used[u] = true;
    totalWeight += minCost[u];

    if (parents[u] != -1) {
      mstMatrix[parents[u]].push_back({u, minCost[u]});
      mstMatrix[u].push_back({parents[u], minCost[u]});
    }

    for (llong v = 0; v < nodeCount; ++v) {
      if (!used[v] && matrix[u][v] < minCost[v]) {
        minCost[v] = matrix[u][v];
        parents[v] = u;
      }
    }
  }

  return {mstMatrix, totalWeight};
}
```

## チェック

- https://atcoder.jp/contests/abc451/submissions/75107745

## 参考

- [プリム法による最小全域木を求めるアルゴリズム | アルゴリズムロジック](https://algo-logic.info/prim-mst/)