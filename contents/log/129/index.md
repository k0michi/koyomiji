# C\#からlong型を含むC言語を呼び出すときは、CLongを用いる

C\#からC言語を呼び出す際の問題の一つに、環境によって`long`の大きさが異なるというものがあります。C言語の仕様では`long`を含む整数型の最小の大きさに関しての指定がありますが、厳密な大きさに関しては実装依存となっています。しかし現在では`int`や`char`などといった`long`以外の整数型は、殆どのプラットフォームで共通した大きさとなっています。

||ILP32/LP64/LLP64|
|-|-|
|`sizeof(char) * 8`|8|
|`sizeof(short) * 8`|16|
|`sizeof(int) * 8`|32|
|`sizeof(long long) * 8`|64|

しかし、問題は`long`の大きさです。一般的な32ビット環境では`long`は32ビットですが、64ビット Unix(-like)では64ビットとなっています。そしてさらにややこしいことに、64ビット WindowsではLLP64と呼ばれるメモリモデルが採用されており、`long`は32ビットになっています。

||ILP32 (macOS/Linux/Windows (32ビット))|LP64 (macOS/Linux (64ビット))|LLP64(Windows (64ビット))|
|-|-|-|-|
|`sizeof(long) * 8`|32|64|32|

これは、インターフェースに`long`が含まれているC言語のコードを、C#から呼び出す際に問題となります。C#の基本型には、プラットフォームによって大きさが異なるC言語の`long`を表現する型が無いためです。

このような場合こそが、.NET 6で導入された[System.Runtime.InteropServices.CLong](https://learn.microsoft.com/ja-jp/dotnet/api/system.runtime.interopservices.clong?view=net-9.0)の出番です。`CLong`はC言語の`long`を表すための型であり、上記の大きさの違いをプラットフォームに応じて自動的に吸収してくれます。考え方としては`IntPtr`の大きさがプラットフォームによって変化するのと同じです。

使い方は単純明快で、`long`に対応する部分の型として`CLong`を指定するだけです。このようなC言語のコードを呼び出したいとします。

```c
#if defined(_WIN32) || defined(_WIN64)
#define DllExport __declspec(dllexport)
#else
#define DllExport
#endif

DllExport long addLongs(long a, long b) { return a + b; }

typedef struct {
  long x;
  long y;
} LongPoint;

DllExport LongPoint addLongPoints(LongPoint p1, LongPoint p2) {
  LongPoint result;
  result.x = p1.x + p2.x;
  result.y = p1.y + p2.y;
  return result;
}
```

これを呼び出すC#コードは、引数やメンバとして`CLong`を指定すれば良いだけです。

```cs
using System.Runtime.InteropServices;

// ...

[DllImport("native", CallingConvention = CallingConvention.Cdecl)]
public static extern CLong addLongs(CLong a, CLong b);

public struct LongPoint {
  public CLong x;
  public CLong y;
}

[DllImport("native", CallingConvention = CallingConvention.Cdecl)]
public static extern LongPoint addLongPoints(LongPoint p1, LongPoint p2);

static void Main(string[] args) {
  {
    CLong a = new CLong(1);
    CLong b = new CLong(2);
    CLong result = addLongs(a, b);
    Console.WriteLine($"addLongs({a.Value}, {b.Value}) = {result.Value}");
  }

  {
    LongPoint lp1 = new LongPoint { x = new CLong(5), y = new CLong(6) };
    LongPoint lp2 = new LongPoint { x = new CLong(7), y = new CLong(8) };
    LongPoint lpResult = addLongPoints(lp1, lp2);
    Console.WriteLine($"addLongPoints({lp1.x.Value}, {lp1.y.Value}) + ({lp2.x.Value}, {lp2.y.Value}) = ({lpResult.x.Value}, {lpResult.y.Value})");
  }
}
```

これによって、macOSでもWindowsでもLinuxでも、全く同じコードで`long`を含むインターフェースを呼び出すことができます。

```
addLongs(1, 2) = 3
addLongPoints(5, 6) + (7, 8) = (12, 14)
```