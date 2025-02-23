# ページからリンクされているファイルを一括ダウンロードする

あるページから直接リンクされているファイルのうち、特定の拡張子を持つものだけを全てダウンロードしたいことがたまにある。例えば講義資料のPDFとか。もちろん右クリック+"Save Link As..."で保存できるのだけど、数が多いと面倒くさい。

Node.jsとかで一括ダウンロードツールを作るということも勿論可能だとは思うけれど、私が考えるより簡単で単純明快な方法は、ブラウザの開発者コンソールと`wget`を用いるというもの。

最初に、ページを開いた状態で、以下のスクリプトを開発者コンソールで実行し、ダウンロードしたいファイルのURLの一覧を保存する。`pattern`の正規表現は、抽出したいものにあわせて適宜変更する。

```js
// 抽出するURLのパターン: RegExp | null
pattern = /\.pdf$/;
// URLリストのファイル名: string
listName = 'urls.txt';

function downloadText(text, fileName) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type : 'plain/text' }));
  a.download = fileName;
  a.click();
}

list = [...document.querySelectorAll('a')]
  .filter(anchor => pattern == null || pattern.test(anchor.href))
  .join('\n');
downloadText(list, listName);
```

ダウンロードすべきURLのリスト(`urls.txt`)が得られたので、実際にファイルを一括ダウンロードする。`wget`には、ファイルに含まれるURLを全てダウンロードする`-i`オプションがあるので、これを用いることで一括ダウンロードが行える。

```
% wget -i urls.txt
```

`curl`の場合はこのようなオプションが存在しないが、`xargs`を用いてURLを一行ずつ渡すことで同様のことが実現できる。

```
% xargs -n 1 curl -O < urls.txt
```