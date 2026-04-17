# ABC 400 D - Takahashi the Wall Breaker

- 問題: https://atcoder.jp/contests/abc400/tasks/abc400_d
- $(y,x)$の位置から可能な遷移を
  - $(y+d_y,x+d_x)$が道ならば、コスト0で$(y+d_y,x+d_x)$
  - $(y+d_y,x+d_x)$が壁ならば、コスト1で$(y+d_y,x+d_x)$**および**$(y+2d_y,x+2d_x)$
- と考えると、ダイクストラ法で解ける ($d=\{(0,1),(0,-1),(1,0),(-1,0)\}$)
- 同じ場所は2回通らないので、マップの破壊状態は記録する必要がない

```cpp
template <class T, class Container = std::vector<T>,
          class Compare = std::greater<typename Container::value_type>>
using ReversePriorityQueue = std::priority_queue<T, Container, Compare>;

constexpr llong kInf = std::numeric_limits<llong>::max() / 2;

std::vector<std::string> S;
llong H, W, A, B, C, D;

llong dijkstra() {
  ReversePriorityQueue<std::pair<llong, std::pair<llong, llong>>> queue;
  std::vector<std::vector<llong>> distances(H, std::vector<llong>(W, kInf));
  queue.push({distances[A][B] = 0, {A, B}});

  while (!queue.empty()) {
    auto [dist, vert] = queue.top();
    auto [y, x] = vert;
    queue.pop();

    if (distances[y][x] < dist) {
      continue;
    }

    for (auto &&d :
         {std::pair<llong, llong>{0, 1}, std::pair<llong, llong>{0, -1},
          std::pair<llong, llong>{1, 0}, std::pair<llong, llong>{-1, 0}}) {
      llong newX = x + d.second;
      llong newY = y + d.first;

      if (newX >= 0 && newX < W && newY >= 0 && newY < H) {
        if (S[newY][newX] == '.') {
          if (distances[newY][newX] > distances[y][x]) {
            distances[newY][newX] = distances[y][x];
            queue.push({distances[newY][newX], {newY, newX}});
          }
        } else {
          if (distances[newY][newX] > distances[y][x] + 1) {
            distances[newY][newX] = distances[y][x] + 1;
            queue.push({distances[newY][newX], {newY, newX}});
          }

          llong nextX = x + d.second * 2;
          llong nextY = y + d.first * 2;

          if (nextX >= 0 && nextX < W && nextY >= 0 && nextY < H &&
              distances[nextY][nextX] > distances[y][x] + 1) {
            distances[nextY][nextX] = distances[y][x] + 1;
            queue.push({distances[nextY][nextX], {nextY, nextX}});
          }
        }
      }
    }
  }

  return distances[C][D];
}

void answer() {
  read(H, W);
  S.resize(H);
  read(S);
  read(A, B, C, D);
  A--, B--, C--, D--;
  writeln(dijkstra());
}
```

- 提出: https://atcoder.jp/contests/abc400/submissions/75007144