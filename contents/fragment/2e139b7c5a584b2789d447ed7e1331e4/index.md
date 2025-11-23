# ABC 398 D - Bonfire

- 問題: https://atcoder.jp/contests/abc398/tasks/abc398_d
- 煙の位置を移動させるのではなくて、焚き火と高橋君が移動していると考える
- 煙の位置は`std::unordered_set`で記録すればOKだが、`std::pair`の場合はハッシュ関数が必要

```cpp
template <typename... T> std::size_t hash(const T &...t) {
  std::size_t result = 1;
  ((result = result * 31 + std::hash<std::decay_t<T>>{}(t)), ...);
  return result;
}

struct PairHash {
  template <typename T, typename U>
  std::size_t operator()(const std::pair<T, U> &pair) const {
    return std::apply(hash<T, U>, pair);
  }
};

void answer() {
  std::unordered_set<std::pair<llong, llong>, PairHash> smokes;
  llong N, R, C;
  read(N, R, C);
  std::string S;
  read(S);
  std::pair<llong, llong> fire{0, 0}, eye{C, R};

  setSeparator("");

  for (llong i = 0; i < N; i++) {
    smokes.insert(fire);
    char d = S[i];

    switch (d) {
    case 'N':
      fire.second++;
      eye.second++;
      break;
    case 'W':
      fire.first++;
      eye.first++;
      break;
    case 'S':
      fire.second--;
      eye.second--;
      break;
    case 'E':
      fire.first--;
      eye.first--;
      break;
    }

    write(smokes.contains(eye) ? '1' : '0');
  }

  writeln();
}
```

- 提出: https://atcoder.jp/contests/abc398/submissions/71188444