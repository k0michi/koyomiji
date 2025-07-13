# JavaScriptでSemaphoreを自作してみる

## Semaphoreの必要性

JavaScriptでは、`async`/`await`のおかげで非同期コードを簡単に記述することができます。しかし、これらの実行タイミングを意識せずにコードを書いていると、ひどい目にあうことになるでしょう。JavaScriptの実行モデルは（WebWorkerを用いない限り）シングルスレッドであるものの、非同期コードはイベントループによって並行（concurrent）に実行されるので、実行順が毎回異なる可能性があるためです。

ブラウザがサーバーにデータを非同期的に送信する例を考えます。UI上にボタンがあって、そのボタンが押された合計の回数をサーバーに送信するというものです:

```ts
function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendCount(value: number) {
  // 実際にはfetchをここでする
  await timeout(Math.random() * 100);
  console.log(`Sent: ${value}`);
}

let count = 0;

// ボタンが押される度、今まで押された数の合計をサーバーに送信するイベントハンドラ
async function onButtonClick() {
  count++;
  await sendCount(count);
}

async function main() {
  const tasks: Promise<void>[] = [];

  // 5回ボタンが押されたと仮定
  for (let i = 1; i <= 5; i++) {
    tasks.push(onButtonClick());
  }

  await Promise.all(tasks);
}

await main();
```

実行結果は例えば次のようになります。`sendCount`の待ち時間がランダムなので、実行ごとに異なる結果になります。

```
Sent: 3
Sent: 1
Sent: 4
Sent: 2
Sent: 5
```

しかし、一般的にこのような合計回数を送信するというシナリオにおいて期待されるのは、

```
Sent: 1
Sent: 2
Sent: 3
Sent: 4
Sent: 5
```

というように、順々に値が増えていく実行順のはずです。

この実行順を保証するには、`sendCount`の中で`await`しているうちは、他の実行フローが`sendCount`の処理に入ってはならないという制限を課す、というのが一つのやり方です。ここで、SemaphoreやMutexといった同期プリミティブを使うことができます。

## Semaphoreを自作してみる

ここでは簡単なSemaphoreを自作してみます。作りはC#の[SemaphoreSlim](https://learn.microsoft.com/ja-jp/dotnet/api/system.threading.semaphoreslim?view=net-8.0)に似せています。

```ts
export default class Semaphore {
  private _currentCount: number;
  private _maxCount: number;
  private _queue: (() => void)[] = [];

  // initialCount: リソースを利用できる実行フロー数の初期値
  // maxCount: リソースを利用できる実行フロー数の最大値
  constructor(initialCount: number, maxCount: number = Infinity) {
    if (initialCount < 0) {
      throw new Error(`initialCount cannot be negative: ${initialCount}`);
    }

    if (initialCount > maxCount) {
      throw new Error(`initialCount cannot exceed maxCount: ${currentCount} > ${maxCount}`);
    }

    this._currentCount = initialCount;
    this._maxCount = maxCount;
  }

  // リソースが利用可能となるまで待ち、リソースを取得する
  public wait(): Promise<void> {
    if (this._currentCount > 0) {
      // リソースが利用可能なとき
      this._currentCount--;
      return Promise.resolve();
    }

    // 利用できないので、待機キューに入れて解放を待つ
    return new Promise<void>((resolve) => {
      this._queue.push(() => {
        // 解放が通知された
        resolve();
      });
    });
  }

  // リソースを解放する
  public release(): void {
    if (this._queue.length > 0) {
      // 待機者がいるとき

      // 待機者に解放を通知する
      const next = this._queue.shift();

      if (next) {
        next();
      }
    } else if (this._currentCount < this._maxCount) {
      // 待機者がいないとき
      this._currentCount++;
    } else {
      throw new Error(`currentCount (${this._currentCount}) has reached maxCount (${this._maxCount})`);
    }
  }

  public get currentCount(): number {
    return this._currentCount;
  }
}
```

使い方は簡単です。`const semaphore = new Semaphore(1)`としてSemaphoreを作成し、クリティカルセクションの手前で`await semaphore.wait()`、終わりで`semaphore.release()`を呼ぶだけです。

先ほどの`sendCount`をSemaphoreを用いて書き直してみます。例外が飛んだ場合でも確実に解放されるよう、`release()`は`finally`句に書きます。

```ts
const semaphore = new Semaphore(1);

async function sendCount(value: number) {
  // 実際にはfetchをここでする

  await semaphore.wait();

  try {
    await timeout(Math.random() * 100);
    console.log(`Sent: ${value}`);
  } finally {
    semaphore.release();
  }
}
```

この変更によって、期待通りの実行順を保証できるようになります。

```
Sent: 1
Sent: 2
Sent: 3
Sent: 4
Sent: 5
```

ただしこの実装では、一般的なSemaphoreと同様に、`semaphore`が取得されているクリティカルセクション内で再度`semaphore`を取得しようとすると、`semaphore`を取得できずにデッドロックを引き起こす可能性があるので、多重ロックには注意を払う必要があります。