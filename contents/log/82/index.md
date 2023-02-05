# AsciiDocを使ってみよう

Markdownのような、簡潔なマークアップからHTMLやXMLを生成する言語を、[軽量マークアップ言語](https://ja.wikipedia.org/wiki/%E8%BB%BD%E9%87%8F%E3%83%9E%E3%83%BC%E3%82%AF%E3%82%A2%E3%83%83%E3%83%97%E8%A8%80%E8%AA%9E)と呼びます。Markdownは最も有名な軽量マークアップ言語ではありますが、実際には他にも沢山あります。[AsciiDoc](https://asciidoc.org/)もその一つです。

AsciiDocの良いところは、Markdownよりも機能が豊富である点です。例えば、目次を挿入したり、ソースコードを別のファイルから埋め込むといったことが可能です。さらに、Markdownでは拡張である、ソースコードのハイライトや脚注、数式の表示などが言語の標準機能として存在します。

また、[Asciidoctor](https://asciidoctor.org/)と呼ばれる、デファクトスタンダードとなっている実装が存在します。Asciidoctor自体はRubyで書かれていますが、Javaバインディングである[AsciidoctorJ](https://docs.asciidoctor.org/asciidoctorj/latest/)や、JavaScriptで動く[Asciidoctor.js](https://docs.asciidoctor.org/asciidoctor.js/latest/)などが用意されているため、多彩な環境で使うことができます。[Asciidoctor PDF](https://docs.asciidoctor.org/pdf-converter/latest/)を使うことで、AsciiDocをLaTeXなどを介さず直接PDFに変換することも可能です。

## Asciidoctorのインストール

Asciidoctorのインストール方法は[公式サイト](https://asciidoctor.org/)に詳しく書かれています。

Macであれば、`brew`でインストールすることができます。

```bash
% brew install asciidoctor
```

インストール出来ているか確認します。

```bash
% asciidoctor -v
Asciidoctor 2.0.18 [https://asciidoctor.org]
Runtime Environment (ruby 3.2.0 (2022-12-25 revision a528908271) [arm64-darwin21]) (lc:UTF-8 fs:UTF-8 in:UTF-8 ex:UTF-8)
```

## Asciidoctor PDFのインストール

Asciidoctor PDFのインストール方法は、[GitHubページ](https://github.com/asciidoctor/asciidoctor-pdf)に詳しく載っています。こちらはgemからインストールする必要があります。

Ruby 2.7以降が必要です。しかし、MacのビルトインのRubyは若干古いです。

```bash
% /usr/bin/ruby -v
ruby 2.6.10p210 (2022-04-12 revision 67958) [universal.arm64e-darwin21]
```

なので、brewで新しいバージョンのRubyをインストールします。

```bash
% brew install ruby
```

Rubyと、gemでインストールされるコマンドにパスを通します。.zshrcに以下の内容を書き加えます。

```
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
export PATH="/opt/homebrew/lib/ruby/gems/3.2.0/bin:$PATH"
```

## Asciidoctorの使い方

AsciiDocの拡張子は.adocです。AsciidoctorにAsciiDocファイルを与えると、HTMLが生成されます。同様にAsciidoctor PDFの場合はPDFが生成されます。

Asciidoctor PDFはデフォルトでは日本語が豆腐になってしまうので、`-a pdf-theme=default-with-fallback-font`を指定します。

```bash
% asciidoctor test.adoc 
% asciidoctor-pdf -a pdf-theme=default-with-fallback-font test.adoc 
% ls
test.adoc	test.html	test.pdf
```

## 書き方

詳細な書き方のリファレンスは、[AsciiDoc Syntax Quick Reference](https://docs.asciidoctor.org/asciidoc/latest/syntax-quick-reference/)にあります。

### 段落

Markdownのように、何も指定しなければ自動的に段落になります。

```
一つ目の段落。

二つ目の段落。
```

### コメント

```
// コメント
```

### 太字、斜体、等幅

ConstrainedとUnconstrainedな書き方があります。Constrainedは修飾記号の前後にスペースや改行が必要ですが、Unconstrainedは必要ありません。

```
*constrained-bold*

_constrained-italic_

`constrained-monospace`

unconstrained-**bold**

unconstrained-__italic__

unconstrained-``monospace``
```

### その他のテキスト修飾

```
#ハイライト#

一部分を##ハイライト##

[.underline]#下線#

[.line-through]#打ち消し#
```

### 上付き、下付き

```
^上付き^文字

~下付き~文字
```

### 記号の置換

いくつかの記号が自動的に置換されます。例えば、`(C)`は©に、`->`は→に、`...`は…​に置換されます。

### リンク

URLは自動的にリンクになります。

```
https://example.com/

https://example.com/[リンクの表示名]
```

### 見出し

ドキュメントの見出しは、ファイルの上部に書きます。

```
= ドキュメントの見出し
著者名 <author@example.com>
v1.0, 2022-02-05
```

著者名などの追加情報はオプショナルです。

```
= ドキュメントの見出し
```

セクションの見出しは、1から5段階あります。

```
== セクションの見出し1

=== セクションの見出し2

==== セクションの見出し3

===== セクションの見出し4

====== セクションの見出し5
```

### リスト

順序なし、順序付き、そしてチェックリストがあります。

```
* リストアイテム
** リストアイテム
* リストアイテム

. 順序付きリストアイテム
.. 順序付きリストアイテム
. 順序付きリストアイテム

* [x] チェック済み
* [ ] 未チェック
```

### 画像

```
image::embedded-image.png[]

image::embedded-image.png[alt属性]
```

### テキストの埋め込み

画像のように、他のテキストファイルを埋め込むことができます。

```
include::embedded-text.txt[]
```

### ソースコード

インラインのソースコードを書くには、`\`に加えて、`+`で囲います。これにより、前述の記号の置換を無効にできます。

```
`+インラインコード...+`
```

コードブロックをハイライトするには、ドキュメントのヘッダーに`:source-highlighter:`を指定する必要があります。他のファイルを埋め込んで表示することもできます。

```
.コードタイトル
[,js]
----
console.log('hello');
----

.コードタイトル
[,js]
----
include::embedded-script.js[]
----
```

### 罫線

```
'''
```

### Admonition

```
NOTE: 追加情報...

IMPORTANT: 重要な情報...

TIP: ヒント...

CAUTION: 注意...

WARNING: 警告...
```

### 表

```
.表タイトル
|===
|列1のヘッダー |列2のヘッダー

|列1行1 |列2行1
|列1行2 |列2行2
|===
```

### 脚注

```
文章...footnote:[脚注の文章]
```

### 数式

ドキュメントのヘッダーに`:stem:`を指定する必要があります。また、デフォルトではAsciiMath記法となっていますが、`:stem: latexmath`を指定することでLaTeX記法を利用できます。

インラインの数式。

```
stem:[\sqrt{2} = 1.41421...]
```

数式ブロック。

```
[stem]
++++
\sqrt{4} = 2
++++
```

Asciidoctor PDFでは、[asciidoctor-mathematical](https://github.com/asciidoctor/asciidoctor-mathematical) gemを入れる必要がありますが、手元の環境(MacBook Pro 2021, macOS 12.6.2)ではうまく動かすことができませんでした。