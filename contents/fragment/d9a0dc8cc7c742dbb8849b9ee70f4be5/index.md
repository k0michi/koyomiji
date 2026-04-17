# ABC 399 D - Switch Seats

- 問題: https://atcoder.jp/contests/abc399/tasks/abc399_d
- `1 2 3 3 1 2`の$(1,2)$の例に注目すると、1つ目の1の右隣の要素(2)を1の2つ目の出現とswapすると`1 1 3 3 2 2`となってペアにできることがわかる
- このことから、ある数字$a$の最初の出現の右隣の要素$b$のもう片方が、$a$の2つ目の出現の左隣または右隣にもあるような場合に、$(a,b)$をペアにできそうと仮説を立てた
  - 最初の$a$の右隣だけを考えるのは、重複ペアをカウントしないため
  - ただし、$a$または$b$が、すでにペアになっている場合は除外する
  - また、最初の$a$の右隣と、2つ目の$a$の左隣が同じ位置であるとswapしても（位置が変化せず）ペアにならないので、そうなっていないことをチェックする必要がある
- 出現位置は先に$O(N)$で`unordered_map`に記録しておき、$O(1)$で取得できるようにする

```cpp
void answer() {
  llong T;
  read(T);

  for (llong i = 0; i < T; i++) {
    llong N;
    read(N);
    std::vector<llong> A(2 * N);
    read(A);
    std::unordered_map<llong, std::vector<llong>> indices;

    for (llong j = 0; j < 2 * N; j++) {
      indices[A[j]].push_back(j);
    }

    llong count = 0;

    for (llong j = 1; j <= N; j++) {
      llong first = indices[j][0];
      llong second = indices[j][1];

      if (first + 1 < 2 * N) {
        llong leftSecond = indices[A[first + 1]][1];
        bool adjacent = leftSecond == second - 1 && first + 1 != second - 1 ||
                        leftSecond == second + 1;
        bool already = first + 1 == second ||
                       indices[A[first + 1]][0] + 1 == indices[A[first + 1]][1];
        count += adjacent && !already;
      }
    }

    writeln(count);
  }
}
```

- 提出: https://atcoder.jp/contests/abc399/submissions/75006631