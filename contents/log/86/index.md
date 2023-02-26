# Mastodonインスタンスを建ててみた

ふとMastodonをやってみたくなり、「[曆路＊さてらいと](https://koyomi.co/)」というMastodonインスタンスを建ててみました。サーバーにはさくらVPSの1Gプラン、OSはUbuntu 22.04を使いました。掛かった時間は、DNS浸透の時間も含めて約4時間程でした。

基本的には、Mastodon公式の[Installing from source](https://docs.joinmastodon.org/admin/install/)に従いました。大雑把な流れとしては:
1. Node.js, PostgreSQLなど諸々のパッケージのインストール
2. Mastodon用管理ユーザの作成
3. Rubyのインストール
4. PostgreSQLのセットアップ
5. Mastodonのセットアップ
6. Nginxのセットアップ
7. SSL証明書の取得
8. systemdサービスのセットアップ

## ハマったところ

Mastodonインスタンスのセットアップでハマったのが、Mastodonアセットのコンパイル失敗です。セットアップスクリプト内でアセットをプリコンパイルするのですが、何度やっても以下のようなメッセージと共にコンパイルが失敗してしまうのです:

```
Compilation failed:

<--- Last few GCs --->

[1908:0x520d1f0]    51547 ms: Mark-sweep 475.0 (494.4) -> 471.9 (494.6) MB, 390.1 / 0.0 ms  (average mu = 0.150, current mu = 0.015) allocation failure scavenge might not succeed
[1908:0x520d1f0]    51947 ms: Mark-sweep 475.8 (494.6) -> 472.7 (495.6) MB, 394.6 / 0.0 ms  (average mu = 0.085, current mu = 0.014) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
...

That failed! Maybe you need swap space?
```

メモリ不足で失敗しているようなのですが、スワップファイルを追加しても同じエラーが発生しました。

色々模索したところ、このエラーは、Node.jsのヒープ容量を制限することで回避することができました。`NODE_OPTIONS="--max-old-space-size=1024"`として、ヒープを1GBに制限しました。

```
$ RAILS_ENV=production NODE_OPTIONS="--max-old-space-size=1024" bundle exec rails assets:precompile
```

もう1ヶ所ハマったところとして、サーバーは動いたもののアセットが全くロードできないという問題に遭遇しました。これは、ディレクトリのパーミッションが正しく無かったことに起因していました。

`/home/mastodon/live/public/`までのディレクトリを、`chmod o+x`でNginxからアクセスできるようにすると、正しくページがロードされるようになりました。

## まだできていないこと

メール送信サーバーの設定をしていないため、サーバーからメールの送信ができません。外部からのユーザー登録を受け付けるのならば必須でしょうが、今のところお一人様インスタンスなので必要なく、放置しています。というのも、自分でSMTPサーバーを構築するのが案外大変なのです。公式ドキュメントではメールプロバイダーを利用することが提案されていますが、課金制だったりします。

また、ElasticSearchはインストールしていないため、全文検索ができません。

一人で使う分にはとりあえず今のままで十分なので、また暇があったらこの辺の問題に対処してみようかと思います。