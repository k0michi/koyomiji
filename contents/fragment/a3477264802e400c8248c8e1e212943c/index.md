# ABC 403 D - Forbidden Difference

- 問題: https://atcoder.jp/contests/abc403/tasks/abc403_d
- $A$のうち、$D$で割った剰余が異なる要素は互いに影響しないので、別々に考える
- 例として$D=3$、剰余が0の場合を考える
  - ![](./Screenshot%202026-04-18%20at%2016.12.19.png)
  - どの数字を削除するべきかは、出現個数によって変化する
  - 同じ数字の出現が複数ある場合、全て残すか、全て消すかのいずれかとなる
  - $i$番目の数字を（全て）削除する場合、削除しない場合で分岐するようなDPを考えれば良さそう、となる
  - ![](./Screenshot%202026-04-18%20at%2016.54.42.png)
- $dp[i]$: $i$番目の数字までで条件を満たすのに、削除すべき数字の最小数
- ベースケース: $dp[0]=0$
- 遷移
  - $i$番目を消し、$i+1$番目に遷移。$i$番目の数字の個数がコストとして加算される
    - $dp[i+1]=\min(dp[i+1],dp[i]+costs[i])$
  - $i$番目を残す
    - $i$番目の数字と$i+1$番目の差が$D$であるとき: $i+1$番目の数字を削除しなければならない。よって$i+1$番目の削除コストを加えて$i+2$に遷移
      - $dp[i+2]=\min(dp[i+2],dp[i]+costs[i+1])$
    - そうでないとき: 追加コスト0で$i+1$に遷移
      - $dp[i+1]=\min(dp[i+1],dp[i])$
- $D=0$の時に0割りでREとなったので、条件分岐して別のロジックで計算
  - $D=0$の場合も一般的に解ける解法が思いつかない

```cpp
template <typename T> auto runLengthEncode(const T &container) {
  using ValueType = std::remove_cvref_t<decltype(*std::begin(container))>;

  std::vector<std::pair<ValueType, llong>> result;

  auto it = std::begin(container);
  auto end = std::end(container);

  if (it == end) {
    return result;
  }

  ValueType last = *it;
  llong length = 0;

  for (; it != end; ++it) {
    if (*it == last) {
      length++;
    } else {
      result.emplace_back(last, length);
      last = *it;
      length = 1;
    }
  }

  result.emplace_back(last, length);
  return result;
}

void answer() {
  llong N, D;
  read(N, D);
  std::vector<llong> A(N);
  read(A);

  std::sort(A.begin(), A.end());
  auto encoded = runLengthEncode(A);

  if (D == 0) {
    llong count = 0;

    for (auto &&[A_i, c] : encoded) {
      count += c - 1;
    }

    writeln(count);
    return;
  }

  std::unordered_map<llong, std::vector<std::pair<llong, llong>>> mod;

  for (auto &&[A_i, count] : encoded) {
    mod[A_i % D].push_back({A_i, count});
  }

  llong count = 0;

  for (auto &&[rem, list] : mod) {
    std::vector<llong> table(list.size() + 1,
                             std::numeric_limits<llong>::max() / 2);
    table[0] = 0;

    for (llong i = 0; i < list.size(); i++) {
      if (i + 1 < list.size() && list[i + 1].first == list[i].first + D) {
        table[i + 1] = std::min(table[i + 1], table[i] + list[i].second);

        if (i + 2 < table.size()) {
          table[i + 2] = std::min(table[i + 2], table[i] + list[i + 1].second);
        }
      } else {
        table[i + 1] = std::min(table[i + 1], table[i]);
      }
    }

    count += table[list.size()];
  }

  writeln(count);
}
```

- 提出: https://atcoder.jp/contests/abc403/submissions/75028519