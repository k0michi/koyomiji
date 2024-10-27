# Deno 2で遊んでみる

JavaScriptのランタイムといえばNode.jsをよく使っていたのだけど、Denoも遂に[2.0](https://deno.com/blog/v2.0)がリリースされたらしいので、触ってみた。ちなみに、筆者はDeno 1.xを使ったことがないので、詳しい使用感の違いとかは書けないので悪しからず。

## インストール

```
% brew install deno
```

## Hello world

denoコマンドでREPLに入れる。

```
% deno
Deno 2.0.3
exit using ctrl+d, ctrl+c, or close()
REPL is running with all permissions allowed.
To specify permissions, run `deno repl` with allow flags.
> console.log("Hell world")
Hell world
undefined
> 
```

JSファイルを指定すると、そのスクリプトを実行できる。この辺まではNode.jsと同じ。

```
% deno hello.js
Hello world
```

## Hello world (TypeScript)

Denoがすごいのは、TypeScriptのスクリプトもそのまま実行できる点。Node.jsでこれをやろうと思うと、ts-nodeとかtsconfig.jsonとか色々やるのが面倒だけど、DenoではTypeScriptがなんと標準装備。ちょっとしたスクリプトでも積極的にTypeScriptを使えそう。

```
% cat hello.ts
const str: string = "Hello world";
console.log(str);
% deno hello.ts
Hello world
```

## npm互換性

Deno 2では、Node.jsとの互換性が追加されたらしいので、これを試してみる。`npm:`でnpmパッケージを直接インポートして使うことができるようだ。

Reactを試してみたが、ちゃんと使うことができた。

```jsx
import * as React from 'npm:react@latest';
import { renderToString } from 'npm:react-dom@latest/server';

function App() {
  return <div>Hello world</div>;
}

console.log(renderToString(<App />));
```

```
% deno react.jsx
┏ ⚠️  Deno requests env access to "NODE_ENV".
✅ Granted env access to "NODE_ENV".
<div>Hello world</div>
```

JSXもzero-configで実行できるのが便利すぎる。

## Node API

Denoには、Node.jsが提供しているAPIへのポリフィルがある。もっとも、これはDeno 2以前から存在しているっぽい。すべてのAPIがサポートされているわけではないが、移植の役に立つだろう。

```
> import os from 'node:os';
undefined
> os.arch()
"arm64"
> os.platform()
"darwin"
> os.version()
"22.6.0"
```

- [Node APIs](https://docs.deno.com/runtime/reference/node_apis/)

## `deno add`

Denoにも`npm install`や`pnpm add`のような、`deno add`コマンドが追加されたよう。

例えば

```
% deno add jsr:@std/path
```

とすると、`deno.json`に依存パッケージとバージョンが書き込まれる。

```json
{
  "tasks": {
    "dev": "deno run --watch main.ts"
  },
  "imports": {
    "@std/path": "jsr:@std/path@^1.0.7"
  }
}
```

これにより、`import * as path from '@std/path';`とするだけで該当パッケージをインポートできるようになる。

個人的に、Deno 1.xを見ていて懐疑的だったのが、import ... from 'https://...'のような冗長なパッケージ指定だったので、これは良い改善と感じた。

## Secure by default

Denoは安全性に注力していて、スクリプトがファイルにアクセスしようとすると、このようなプロンプトが表示されて、実行が中断されるようになっている。

```
% deno fs.ts
┏ ⚠️  Deno requests read access to "/Users/k0michi/Local/Playground/hello.txt".
┠─ Requested by `Deno.readFile()` API.
┠─ Learn more at: https://docs.deno.com/go/--allow-read
┠─ Run again with --allow-read to bypass this prompt.
┗ Allow? [y/n/A] (y = yes, allow; n = no, deny; A = allow all read permissions) >
```

この方が安全なのは間違いないが、これが煩わしい場合には`--allow-all`または`-A`でこのセキュリティを無効化できる:

```
% deno --allow-all fs.ts
```

## JavaScript Registry

Deno 2ではJSR (JavaScript Registry)という新しいレジストリが導入されたようだ。

JSRの良いところは、ESModuleのみのサポートである点、そしてTypeScriptがネイティブサポートされている点である。CommonJSが蔓延り続けるnpmと比べて、相互運用性が高まることが期待できると思うし、型定義に悩むことも少なくなると思われる。

加えて、JSR上のモジュールはNode.jsからも使うことができるようになっているのが素晴らしい。

- [Using JSR with Node.js - Docs - JSR](https://jsr.io/docs/with/node)

## そのほか

そのほかにも、Deno 2ではNext.jsなどといったフレームワークをサポートするようになったらしい。

あと、[Fresh](https://fresh.deno.dev/)という、Deno公式によるPreactを使ったフレームワークを見つけた。結構良さそう。

## おまけ

Dinoくん(ハロウィン風)

![](dino.png)