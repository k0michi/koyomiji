# Fedora 44にcode-serverをセットアップしてLANで公開する

- [code-server](https://github.com/coder/code-server)をセルフホストすると、サーバー上で動くVSCodeをそのままWeb UIとして公開することができる
  - リモートのブラウザ上からコードを書き換えたり、コマンドを叩いたりできる優れもの
  - VPNと組み合わせると、外からでも重たい処理を自宅サーバーに投げつつ開発できる
- 環境
  - Fedora KDE Plasma Desktop 44
- セットアップ
  1. code-serverをインストール。途中で管理者パスワードを聞かれるので入力
     ```
     $ curl -fsSL https://code-server.dev/install.sh | sh
     ```
  2. `$USER`の権限で起動する
     ```
     $ sudo systemctl restart code-server@$USER
     ```
     この時点で、`127.0.0.1:8080`を開くとログイン画面が見えるはず
  　　![](./Screenshot%202026-06-07%20at%2010-15-19%20code-server%20login.png)
  3. デフォルトでは外からアクセスできないので、設定を変更する
     ```
     $ nano ~/.config/code-server/config.yaml
     ```
     ```
     bind-addr: 0.0.0.0:8080
     auth: password
     password: (パスワード)
     cert: false
     ```
     `bind-addr`を`127.0.0.1`から`0.0.0.0`に変更することで、LANに公開されるようになる。パスワードもここで変更できる
  4. ポートを開放する
     ```
     $ sudo firewall-cmd --add-port=8080/tcp --permanent
     $ sudo firewall-cmd --reload
     ```
  5. 再起動する
     ```
     $ sudo systemctl restart code-server@$USER
     ```
     `(サーバーのホスト):8080`でパスワードを入力すると、code-serverが開く！
     ![](./Screenshot%202026-06-07%20at%2010-17-40%20Welcome%20-%20code-server.png)
- 既知の問題
  - 画像が見られない。HTTPS化していないためと思われる
- 参考
  - [Install code-server: OS Instructions for VS Code | code-server Docs](https://coder.com/docs/code-server/install)