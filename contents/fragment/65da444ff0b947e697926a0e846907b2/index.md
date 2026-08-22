# CSES Problem Set - Distinct Numbers

- 問題
  - https://cses.fi/problemset/task/1621
- 単純に`unordered_set`で集計したらTLEした
- 調べてみると、テストケースがハッシュ衝突するように細工されているらしい
  - `unordered_set`は衝突すると挿入が$O(n)$に近づく
- ハッシュ関数を実行時ランダム+Splitmix64に変えたらACできた

```cpp
struct Splitmix64 {
  static uint64_t splitmix64(uint64_t x) {
    x += 0x9e3779b97f4a7c15;
    x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
    x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
    return x ^ (x >> 31);
  }

  size_t operator()(uint64_t x) const {
    static const uint64_t FIXED_RANDOM =
        std::chrono::steady_clock::now().time_since_epoch().count();
    return splitmix64(x + FIXED_RANDOM);
  }
};

void answer() {
  llong n;
  read(n);
  std::unordered_set<llong, Splitmix64> x;

  for (llong i = 0; i < n; i++) {
    llong x_i;
    read(x_i);
    x.insert(x_i);
  }

  writeln(x.size());
}
```

## 参考

- [Blowing up unordered_map, and how to stop getting hacked on it - Codeforces](https://codeforces.com/blog/entry/62393)