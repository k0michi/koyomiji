# Goのgoroutineはノンブロッキング

- Goには、JavaScriptやC#などのような`async`/`await`の概念が存在しない。つまり、コードは同期的に書かれている。それでは、どのようにノンブロッキングIOを実現しているのか？
- Goはこの問題をgoroutineという名の軽量スレッドで解決している
- 実は、Goのgoroutineは同期的に書けるコルーチンのようなものであり、待ちが発生すると中断され、待ちが完了すると再開される
  - goroutineが中断された瞬間、そのOSスレッドが実行するgoroutineが他のものに切り替わるので、OSスレッドはブロックされない
  - これが軽量スレッドの考え方
  - JavaScriptで言えば、待ちが発生する全ての関数呼び出しに自動で`await`が付くイメージ
- 環境変数`GOMAXPROCS`で、並行に実行されるgoroutineの数が決まる。この値はデフォルトではCPUの論理コア数と一致する
- 10000個のgoroutineを立てて全てでスリープする例。軽量スレッドなので、OSのスレッドが10000個立てられることなく、並行に完了する:
  ```go
  package main

  import (
    "fmt"
    "sync"
    "time"
  )

  func main() {
    const numGoroutines = 10000
    const sleepDuration = 1 * time.Second

    fmt.Printf("Starting %d goroutines...\n", numGoroutines)

    start := time.Now()

    var wg sync.WaitGroup

    for i := 0; i < numGoroutines; i++ {
      wg.Add(1)

      go func(id int) {
        defer wg.Done()

        time.Sleep(sleepDuration)
      }(i)
    }

    wg.Wait()

    elapsed := time.Since(start)
    fmt.Printf("All goroutines completed in %dms\n", elapsed.Milliseconds())
  }
  ```
  ```
  Starting 10000 goroutines...
  All goroutines completed in 1025ms
  ```
- Javaでも仮想スレッド（Virtual Thread）という名称で軽量スレッドが導入されている。これでgoroutineと同様のことが実現できる:
  ```java
  import java.time.Duration;
  import java.time.Instant;
  import java.util.concurrent.Executors;
  import java.util.stream.IntStream;

  public class Main {
    public static void main(String[] args) {
      int numTasks = 10000;
      long sleepDuration = 1000;

      System.out.printf("Starting %d virtual threads...%n", numTasks);

      var start = Instant.now();

      try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
        for (int i = 0; i < numTasks; i++) {
          final int id = i;

          executor.submit(() -> {
            try {
              Thread.sleep(sleepDuration);
            } catch (InterruptedException e) {
              Thread.currentThread().interrupt();
            }
          });
        }
      }

      var end = Instant.now();
      var elapsed = Duration.between(start, end);

      System.out.printf("All virtual threads completed in %dms%n",
                        elapsed.toMillis());
    }
  }
  ```
  ```
  Starting 10000 virtual threads...
  All virtual threads completed in 1054ms
  ```