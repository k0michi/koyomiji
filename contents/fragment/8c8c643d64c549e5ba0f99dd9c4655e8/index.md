# CSES Problem Set - Missing Coin Sum

- 問題
  - https://cses.fi/problemset/task/2183/
- 考察
  - コインの部分集合で作れる範囲が、不連続になる状況を漸化式的に考える
  - $x$の最小値が2以上なら明らかに答えは1となる
  - $x$の最小値が1の場合を考える
    - コインのmultiset $\{1\}$に対して、コインの部分集合で作れる範囲は$[1,2)$である
    - 1の次に小さいコインを考える
      - $\{1,1\}$に対して可能な範囲は$[1,3)$
      - $\{1,2\}$に対して可能な範囲は$[1,4)$
      - しかし$\{1,3\}$に対しては範囲が不連続となる。答えは2である
    - 一般に、$x$をソートし、$x_1,\dots,x_k$でちょうど$[1,max+1)$が作れる時に、$x_{k+1}>max+1$ならば、$max+1$は作ることができない最小の整数となる

```cpp
void answer() {
  llong n;
  read(n);
  std::vector<llong> x(n);
  read(x);

  std::sort(x.begin(), x.end());

  llong max = 0;
  for (llong i = 0; i < n; i++) {
    if (x[i] > max + 1) {
      writeln(max + 1);
      return;
    }

    max = max + x[i];
  }

  writeln(max + 1);
}
```