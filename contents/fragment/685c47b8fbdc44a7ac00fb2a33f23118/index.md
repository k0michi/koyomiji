# ABC 406 C - ~

- AtCoder最近やってなかったので過去問練習
- 問題: https://atcoder.jp/contests/abc406/tasks/abc406_c
- この問題のチルダ型とは、上がって下がって上がる部分列のこと
- 単調増加する部分列$P$、単調減少する部分列$Q$、単調増加する部分列$R$、が並んでいるとき、この中のチルダ型部分列の個数は$|P|\times|R|$
- 数列の差$A_{i+1}-A_i$の符号に着目して、同じ符号の連続をカウントした列を作ると、この計算を楽に行える
- 数値の符号だけを返す`signum`関数が便利なので作った
  - Is there a standard sign function (signum, sgn) in C/C++? - Stack Overflow  
  https://stackoverflow.com/questions/1903954/is-there-a-standard-sign-function-signum-sgn-in-c-c

## 解答

```cpp
template <typename T, typename = std::enable_if_t<std::is_integral_v<T>>>
constexpr std::make_signed_t<T> signum(T value) {
  return (std::make_signed_t<T>(0) < std::make_signed_t<T>(value)) -
         (std::make_signed_t<T>(value) < std::make_signed_t<T>(0));
}

void answer() {
  llong N;
  read(N);
  std::vector<llong> P(N);
  read(P);

  std::vector<llong> slopes{0};

  for (llong i = 0; i + 1 < N; ++i) {
    auto diff = P[i + 1] - P[i];

    if (signum(slopes.back()) != signum(diff)) {
      slopes.push_back(0);
    }

    slopes.back() += signum(diff);
  }

  llong count = 0;

  for (llong i = 0; i + 2 < slopes.size(); i++) {
    if (slopes[i] > 0) {
      count += slopes[i] * slopes[i + 2];
    }
  }

  writeln(count);
}
```

- 提出: https://atcoder.jp/contests/abc406/submissions/71169104