# ABC342 D - Square Pair

- 問題: https://atcoder.jp/contests/abc342/tasks/abc342_d
- $A_iA_j$が平方数であるということは、素因数分解して$A_iA_j=a^{2n}b^{2m}c^{2n}\dots$のように書ける、ということ
  - $a,b,c,\dots$は素数
  - つまり、指数を2の倍数に揃えれば良い
- つまり、「$A_i$を素因数分解し、掛けて$A_i$の素因数の指数を全て2の倍数にできる非負整数は、$A_1,\dots,A_{i-1}$のうち何個あるか？」が$O(1)$で分かれば、これの合計を取れば答えとなる
- 0と1のときの扱いに注意

```cpp
std::unordered_map<llong, llong> primeFactorize(llong n) {
  std::unordered_map<llong, llong> factors;

  if (n <= 1) {
    return factors;
  }

  while (n % 2 == 0) {
    factors[2]++;
    n /= 2;
  }

  for (llong i = 3; i * i <= n; i += 2) {
    while (n % i == 0) {
      factors[i]++;
      n /= i;
    }
  }

  if (n > 1) {
    factors[n]++;
  }

  return factors;
}

struct UnorderedSetHash {
  template <typename T>
  std::size_t operator()(const std::unordered_set<T> &set) const {
    std::size_t result = 0;

    for (const auto &e : set) {
      result += std::hash<T>{}(e);
    }

    return result;
  }
};

void answer() {
  llong N;
  read(N);
  std::unordered_map<std::unordered_set<llong>, llong, UnorderedSetHash> counts;
  llong result = 0;
  llong zeros = 0;

  for (llong i = 0; i < N; i++) {
    llong A_i;
    read(A_i);

    auto factors = primeFactorize(A_i);
    std::unordered_set<llong> factors2;

    for (auto &&[f, c] : factors) {
      if (c % 2 != 0) {
        factors2.insert(f);
      }
    }

    if (A_i != 0) {
      result += counts[factors2] + zeros;
    } else {
      result += i;
    }

    counts[factors2] += A_i != 0;
    zeros += A_i == 0;
  }

  writeln(result);
}
```

- 提出: https://atcoder.jp/contests/abc342/submissions/71335196