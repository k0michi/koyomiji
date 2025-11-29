# Java 25で追加されたjava.lang.IOクラス

- Java 25で、`java.lang.IO`という手軽に使えるIOユーティリティが追加されている
  - [IO (Java SE 25 &amp; JDK 25)](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/IO.html)
- 主に、3つの操作が提供されている:
  - `print(obj)`: `obj`を`System.out`に出力
  - `println(obj)`: `obj`を`System.out`に出力、改行あり
  - `readln(prompt)`: `prompt`文字列をプロンプトとして表示し、`System.in`から一行入力
- jshellでの使用例:
  ```
  jshell> IO.print("hello");
  hello
  IO.println("hello");
  hello

  jshell> IO.readln("Your name: ");
  Your name: foo
  $8 ==> "foo"
  ```
- さらに、Java 25では[Compact Source Files](https://openjdk.org/jeps/512)と呼ばれる書き方も導入されているので、これを組み合わせると、Hello worldプログラムは
  ```java
  void main() {
    IO.println("Hello world");
  }
  ```
  と書くことができる