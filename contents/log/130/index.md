# requestAnimationFrameをPromise化して、ゲームループを書く

JavaScriptでは、C/C++を用いたゲームプログラミングで一般的な、いわゆる「ゲームループ」を書くことはできません。ゲームループとは例えば、次のような更新と描画を繰り返すコードです:

```ts
while (true) {
  update();
  render();
}
```

ブラウザ上のJavaScriptにおいては、上記のようなブロッキングなコードを書くことは許されていません。これは、ブラウザという環境が、本質的に非同期であることに起因しています。

このようなブロッキングを避けるために、一般的には`setTimeout`や`window.requestAnimationFrame`が用いられます。特に、画面の更新を行う場合は、`window.requestAnimationFrame`を用いることで、ブラウザ側の描画のタイミング（垂直同期）に合わせて処理を実行することができます。

```ts
function frame() {
  update();
  render();
  window.requestAnimationFrame(frame);
}

window.requestAnimationFrame(frame);
```

この`window.requestAnimationFrame`を`Promise`でラップすることで、以下のような「非同期な」ゲームループを書くことが可能になります。`async`/`await`のおかげで、再帰的なコールバック呼び出しが不要となるため、コードがより直感的になります:

```ts
function requestAnimationFrame(): Promise<number> {
  return new Promise((resolve) => {
    window.requestAnimationFrame((time) => {
      resolve(time);
    });
  });
}

while (true) {
  await requestAnimationFrame();
  update();
  render();
}
```

`window.requestAnimationFrame`を`Promise`化する利点は、コードの見栄えだけではありません。次のように`Promise.any`と組み合わせることによって、「次の描画タイミングが訪れるか、または、一定時間が経過する」まで待つ、といったことが可能となります。`window.requestAnimationFrame`は、タブが切り替わってページが非表示になった時（バックグラウンド時）に、コールバックが呼ばれる頻度が低下したり、全く呼び出されなくなるようになっていますが、このように書くことで全く呼び出されなくなる事態を避けることができます（ただし、`setTimeout`もバックグラウンド時には呼び出し頻度が低下するため、指定した間隔になるとは限らないことに注意）。

```ts
function requestAnimationFrame(): Promise<number> {
  return new Promise((resolve) => {
    window.requestAnimationFrame((time) => {
      resolve(time);
    });
  });
}

function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

while (true) {
  await Promise.any([requestAnimationFrame(), timeout(1000)]);
  update();
  render();
}
```