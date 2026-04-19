# ABC 454 (A,B,C,D問題)

- [AtCoder Beginner Contest 454](https://atcoder.jp/contests/abc454)の記録

## A問題

```cpp
void answer() {
  llong L, R;
  read(L, R);
  writeln(R - L + 1);
}
```

## B問題

- `unordered_set`で一意な服の種類の数を計算すると楽

```cpp
void answer() {
  llong N, M;
  read(N, M);
  std::vector<llong> F(N);
  read(F);

  std::unordered_set<llong> unique(F.begin(), F.end());
  writeln(F.size() == unique.size() ? "Yes" : "No");
  writeln(M == unique.size() ? "Yes" : "No");
}
```

## C問題

- $(A_i,B_i)$をエッジとした有向グラフの、始点ノードからの到達可能ノードの数を答える
- BFSで実装
- DFSの方が楽かも

```cpp
void answer() {
  llong N, M;
  read(N, M);
  std::vector<llong> A(M), B(M);
  std::unordered_map<llong, std::vector<llong>> nexts;

  for (llong i = 0; i < M; i++) {
    read(A[i], B[i]);
    nexts[A[i]].push_back(B[i]);
  }

  std::unordered_set<llong> items;
  std::queue<llong> q;
  q.push(1);

  while (q.size() > 0) {
    auto i = q.front();
    q.pop();

    if (items.contains(i)) {
      continue;
    }

    items.insert(i);

    for (auto n : nexts[i]) {
      q.push(n);
    }
  }

  writeln(items.size());
}
```

## D問題

- $A$の`xx`を`(xx)`に置き換えて$A=B$とできるなら、$B$の`(xx)`を`xx`と置き換えても$A=B$とできる。逆も然り。なので
  - $A$の`(xx)`を`xx`に置き換える操作
  - $B$の`(xx)`を`xx`に置き換える操作

  の操作体系でも同じ答えが得られる
- 文字列中に`(xx)`がある限り、これを`xx`で置き換える操作を$f$とすると
  - $f(A)=f(B)$なら`Yes`、そうでないなら`No`と答えれば良い
- しかし`std::string::replace`だとTLEしてしまう。後続の要素をずらすコストがかかるため
- 文字列$A$をコードとみなしたスタックマシンを考える
  - `)`を消費した時
    - スタックの末尾が`(xx`であるならこれらをpopし、`xx`をpush
    - そうでないなら`)`をpush
  - それ以外の文字を消費した時はそのままpush
  - すべての文字を消費した後のスタックは$f(A)$と一致する
- $A,B$それぞれに適用して$f(A)=f(B)$を見るので、1ケースに対して時間計算量 $O(|A|+|B|)$

```cpp
std::vector<char> reconstruct(std::string &str) {
  std::vector<char> s;

  for (auto a : str) {
    if (a == ')') {
      if (s.size() >= 3 && s[s.size() - 3] == '(' && s[s.size() - 2] == 'x' &&
          s[s.size() - 1] == 'x') {
        s.pop_back();
        s.pop_back();
        s.pop_back();
        s.push_back('x');
        s.push_back('x');
      } else {
        s.push_back(a);
      }
    } else {
      s.push_back(a);
    }
  }

  return s;
}

void answer() {
  llong T;
  read(T);

  for (llong i = 0; i < T; i++) {
    std::string A, B;
    read(A, B);
    writeln(reconstruct(A) == reconstruct(B) ? "Yes" : "No");
  }
}
```