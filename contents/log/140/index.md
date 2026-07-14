# いろんな言語でPrintableインターフェースを後付けしてみた

Rustなどのモダンな言語では、既存の型を、自作のインターフェース（トレイト）に準拠させることが可能です。この機能はかなり強力で、標準ライブラリの`String`やサードパーティーライブラリの型に、自作のインターフェースを「後付け」することが可能です。これにより、自前のオブジェクトも、サードパーティのオブジェクトも、自前のインターフェースでやり取りできるようになるので、無駄にラッパークラスを書いたりする必要が無くなります。

今回は色々な言語で、自身の情報をprintする`Printable`インターフェースを後付けしてみます。

## Rust

Rustの`trait`は、まさにこのための機能です。ただし、Rustでは、"Orphan Rule"と呼ばれる制限があり、外部クレートの型に外部クレートのトレイトを実装することはできません。しかしこの制限のおかげで、二重にトレイトが実装されることが防止され、呼び出すべき対象を一意に決定することができます。

```rust
trait Printable {
    fn print(&self);
}

impl Printable for i32 {
    fn print(&self) {
        println!("i32: {}", self);
    }
}

impl Printable for String {
    fn print(&self) {
        println!("String: {}", self);
    }
}

fn process_printable<T: Printable>(printable: T) {
    printable.print();
}

fn main() {
    process_printable(42);
    process_printable(String::from("Hello"));
}
```

## Swift

Swiftではインターフェースはプロトコルによって表現されます。`extension`によって、既存の型に独自のプロトコルを生やせます。

```swift
protocol Printable {
    func print()
}

extension Int: Printable {
    func print() {
        Swift.print("Int: \(self)")
    }
}

extension String: Printable {
    func print() {
        Swift.print("String: \(self)")
    }
}

func processPrintable(_ printable: Printable) {
    printable.print()
}

processPrintable(42)
processPrintable("Hello")

```

Rustと異なるのは、外部プロトコルを外部の型に実装可能である、という点です。ただし、外部ライブラリが将来的にこのプロトコルを実装した場合衝突するので、警告となります。

```
main.swift:3:1: warning: extension declares a conformance of imported type 'URL' to imported protocol 'Identifiable'; this will not behave correctly if the owners of 'Foundation' introduce this conformance in the future
 1 | import Foundation
 2 | 
 3 | extension URL: Identifiable {
   | |- warning: extension declares a conformance of imported type 'URL' to imported protocol 'Identifiable'; this will not behave correctly if the owners of 'Foundation' introduce this conformance in the future
   | `- note: add '@retroactive' to silence this warning
 4 |     public var id: String {
 5 |         self.absoluteString
```

## Scala

ScalaはJVM言語では珍しく、インターフェースの後付けを行うことができます。

```scala
trait Printable[T]:
  extension (x: T) def print(): Unit

given Printable[Int] with
  extension (x: Int) def print(): Unit =
    println(s"Int: $x")

given Printable[String] with
  extension (x: String) def print(): Unit =
    println(s"String: $x")

def processPrintable[T: Printable](printable: T): Unit =
  printable.print()

@main def run(): Unit =
  processPrintable(42)
  processPrintable("Hello")
```

## Haskell

昨今の言語のインターフェース後付けの潮流の元ネタがHaskellです。Haskellの`class`は、他の言語で言うところのインターフェースやトレイトであり、`instance`が`impl`です。

Haskellには"Orphan Instance"なる概念が存在します。これは、Rustの"Orphan Rule"の元ネタであり、すなわち、外部のクラスを外部の型に実装することはできないようになっています。

```hs
import Prelude hiding (print)

class Printable a where
  print :: a -> IO ()

instance Printable Int where
  print x = putStrLn ("Int: " ++ show x)

instance Printable String where
  print x = putStrLn ("String: " ++ x)
  
processPrintable :: Printable a => a -> IO ()
processPrintable printable = Main.print printable

main :: IO ()
main = do
  processPrintable (42 :: Int)
  processPrintable "Hello, World!"
```

## TypeScript

JavaScriptはプロトタイプベースなので勿論勝手にメソッドを追加できます。そして、TypeScriptでは`interface`はDeclaration Mergingによってマージされるので、これらを組み合わせると型安全にメソッドを生やすことが可能です。

```ts
interface Printable {
  print(): void;
}

interface Number extends Printable { }

Number.prototype.print = function (): void {
  console.log(`Number: ${this}`);
}

interface String extends Printable { }

String.prototype.print = function (): void {
  console.log(`String: ${this}`);
}

function processPrintable(printable: Printable): void {
  printable.print();
}

processPrintable(42);
processPrintable("Hello");
```

## Objective-C

Objective-Cにはカテゴリと呼ばれる機能があり、これを用いると既存の型を魔改造することができます。そしてもちろん、プロトコルを後付けすることも可能です。

```objc
#import <Foundation/Foundation.h>

@protocol Printable <NSObject>
- (void)print;
@end

@interface NSString (PrintableExtension) <Printable>
@end

@implementation NSString (PrintableExtension)
- (void)print {
  NSLog(@"NSString: %@", self);
}
@end

@interface NSNumber (PrintableExtension) <Printable>
@end

@implementation NSNumber (PrintableExtension)
- (void)print {
  NSLog(@"NSNumber: %@", self);
}
@end

void processPrintable(id<Printable> printable) { [printable print]; }

int main(int argc, const char *argv[]) {
  @autoreleasepool {
    processPrintable(@42);
    processPrintable(@"Hello");
  }
  return 0;
}
```

## まとめ

6つの言語で`Printable`インターフェースを後付けしてみました。それぞれの言語の個性が表れていて面白いです。この機能が関数型言語由来であることは知っていましたが、まさかObjective-Cでも可能であるとは知らなかったですね。