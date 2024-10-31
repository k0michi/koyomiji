# path.dirname()は親ディレクトリを返すわけじゃない？ [Node.js]

一番最初に断っておきますが、この記事では「親ディレクトリ」という少しばかり曖昧な用語をこう定義しています:

- ファイルシステムを根付き木(rooted tree)として考え、ファイルとディレクトリを各頂点として表す。頂点$v$の親$v'$を、$v$の**親ディレクトリ**と呼ぶ。

---

Node.jsの[Path API](https://nodejs.org/dist/latest/docs/api/path.html)には、`path.dirname(path)`という関数があります。

この関数に例えば、`'/a/b/c/d.json'`というパスを与えると、こうなります。

```
> path.dirname('/a/b/c/d.json')
'/a/b/c'
```

相対パスの場合も見てみましょう。

```
> path.dirname('a/../c/d/')
'a/../c'
```

これを見たあなたはこう思ったかもしれません。なるほど、`path.dirname()`は、与えられたファイル/ディレクトリのパスの親ディレクトリのパスを返す関数なのだ、と。そう思うのも不思議ではありません。なぜならこの関数は、大体の場合には親ディレクトリを返すのですから。

**ですが、次の例を見ると、この認識は全くの誤りであることがわかります。**

```
> path.dirname('/a/b/c/..')
'/a/b/c'
```

`/a/b/c/..`を渡した結果返されたパスは`/a/b/c`。これは明らかに、**`/a/b/c/..`の親ディレクトリではありません。**`/a/b/c/..`とはつまり`/a/b`なのですから、その親ディレクトリは`/a`になるはずです。

```
> path.dirname('/a/b/c/.')
'/a/b/c'
```

`/a/b/c/.`を渡した結果返されたパスは`/a/b/c`。`/a/b/c/.`の`.`を解決すると`/a/b/c`。親ディレクトリは`/a/b`なので、これまた返却されたパスは親ディレクトリではありません。

つまり、`path.dirname()`は親ディレクトリのパスを返す関数ではないことがわかります。実際に返されるのは、単にパスの最後の`/`以降を切り落としたパスで、それが親ディレクトリであるとは限りません。ファイルへのパスの場合には、偶然にもファイルの親ディレクトリが返却されるというだけです。

## 仕様を読んでみる

Node.jsのAPIリファレンスでは、`path.dirname`は次のように説明されています。

> The `path.dirname()` method returns the directory name of a path, similar to the Unix `dirname` command. Trailing directory separators are ignored, see `path.sep`.

- [Path | Node.js v23.1.0 Documentation](https://nodejs.org/dist/latest/docs/api/path.html#pathdirnamepath)

UNIXの`dirname`を模倣しているよ、という以上の情報がないので、POSIXの仕様を見てみましょう。

> The dirname() function shall take a pointer to a character string that contains a pathname, and return a pointer to a string that is a pathname of the directory containing the entry of the final pathname component.

- [dirname](https://pubs.opengroup.org/onlinepubs/9799919799/functions/dirname.html)

最後のpathname componentを含むディレクトリのpathnameを返す、と言っています。確かに、UNIXシステムでは`..`や`.`が隠しディレクトリとして存在しているので、それを考慮すると`/a/b/..`の`..`は`/a/b`がcontainしている、と言えるでしょう。

(ちなみに、これがこの記事の最初に断り書きを加えた理由です。ファイルシステムを巡回グラフと考えれば、「`/a/b/..`の`..`は隠れているとはいえディレクトリなのだから、`/a/b`が`..`の親ディレクトリだろう！」という詭弁が成立してしまうので……)

`basename`のEXAMPLESセクションの表には、`dirname`に`/home/dwc/.`を与えると`/home/dwc`が返却される、という記載があります。これはNode.jsの挙動と一致します。

- [basename](https://pubs.opengroup.org/onlinepubs/9799919799/functions/basename.html)

## 正しい親ディレクトリの取り方

`path.join()`関数で、パスの末尾に`..`を連結すれば、正しい親ディレクトリを得ることができます。ファイルパスの場合も問題ありません。

```
function getParent(p) {
  return path.join(p, '..');
}

> getParent('/a/b/c/d.json')
'/a/b/c'
> getParent('a/../c/d/')
'c'
> getParent('/a/b/c/..')
'/a'
> getParent('/a/b/c/.')
'/a/b'
```

## 【おまけ】LLMに聞いてみた

### ChatGPT

[Node.js] path.dirname()は親ディレクトリを返す関数ですか？

> はい、`path.dirname()` は指定したパスの「親ディレクトリ」を返す関数です。
> 
> 例えば、以下のように使用します：
> 
> ```javascript
> const path = require('path');
> 
> const filePath = '/Users/example/Documents/file.txt';
> console.log(path.dirname(filePath));
> ```
> 
> このコードの出力は以下になります：
> 
> ```
> /Users/example/Documents
> ```
> 
> このように、`path.dirname()` は指定したパスから最後の部分（ファイルやフォルダ名）を取り除き、その親ディレクトリを返します。

### Claude

[Node.js] path.dirname()は親ディレクトリを返す関数ですか？

> いいえ、`path.dirname()`は完全に異なる機能を持っています。
> 
> `path.dirname()`は、与えられたパス文字列からファイル名やディレクトリ名を除いた、ディレクトリパスを返す関数です。
> 
> 例を見てみましょう：
> 
> ```javascript
> const path = require('path');
> 
> console.log(path.dirname('/foo/bar/baz.txt'));
> // 出力: /foo/bar
> 
> console.log(path.dirname('/foo/bar/'));
> // 出力: /foo
> 
> console.log(path.dirname('/foo/'));
> // 出力: /
> ```
> 
> 親ディレクトリを取得したい場合は、次のような方法があります：
> 
> 1. `path.join()` と `..` を使用する:
> ```javascript
> const path = require('path');
> 
> // 現在のディレクトリの親ディレクトリを取得
> const parentDir = path.join(__dirname, '..');
> ```
> 
> 2. `path.resolve()` を使用する:
> ```javascript
> const path = require('path');
> 
> // 現在のディレクトリの親ディレクトリを取得
> const parentDir = path.resolve(__dirname, '..');
> ```