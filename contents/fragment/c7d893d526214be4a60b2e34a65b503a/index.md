# ローカルサーバー監視ツールBeszelを入れてみる

- サーバーが増えてきたので、ふとサーバー監視ツールを試したくなった
- [Beszel](https://beszel.dev/)というのが新しくて良さそう、ということでインストール
- 基本的には[Getting Started](https://beszel.dev/guide/getting-started)に従えば良い。Docker Composeで入れてみる
  1. 指示通り`docker-compose.yml`を作る。ただし他にもPocketBaseを使ったツールが立ってる場合は、ポートが競合するので変更する
     ```yml:docker-compose.yml
     services:
       beszel:
         image: henrygd/beszel:latest
         container_name: beszel
         restart: unless-stopped
         ports:
           - 8090:8090
         volumes:
           - ./beszel_data:/beszel_data
           - ./beszel_socket:/beszel_socket
   
       beszel-agent:
         image: henrygd/beszel-agent:latest
         container_name: beszel-agent
         restart: unless-stopped
         network_mode: host
         volumes:
           - ./beszel_agent_data:/var/lib/beszel-agent
           - ./beszel_socket:/beszel_socket
           - /var/run/docker.sock:/var/run/docker.sock:ro
         environment:
           LISTEN: /beszel_socket/beszel.sock
           HUB_URL: http://localhost:8090
           TOKEN: <token>
           KEY: "<key>"
     ```
  2. `docker compose up`を実行し、ブラウザで`http://localhost:8090`を開く
  3. アカウント作成画面が出るので、作成
  4. "Add System"ボタンをクリックして、"Public Key"と"Token"をコピーしておく

     ![](./Screenshot%202025-12-22%20at%2000-09-15%20All%20Systems%20_%20Beszel.png)
  5. `^C`で一度コンテナを停止。`docker-compose.yml`の`<key>`と`<token>`を先ほどの"Public Key"と"Token"で置き換える
  6. `docker compose up -d`を実行。Beszelをデーモンとして起動する
  7. 再び"Add System"をクリック。"Name"には適当な名前、"Host / IP"には"/beszel_socket/beszel.sock"を入力

     ![](./Screenshot%202025-12-22%20at%2000-09-43%20All%20Systems%20_%20Beszel.png)
  8. "Add server"を押す。うまくいっていれば、サーバーの状態が確認できるようになる

     ![](./Screenshot%202025-12-22%20at%2000-10-01%20All%20Systems%20_%20Beszel.png)
- サーバー監視画面。直感的で美しい

  ![](./Screenshot%202025-12-22%20at%2001-01-58%20kaga.local%20_%20Beszel.png)
- リモートサーバーの追加もDocker Composeを用いていれば簡単に行える
  1. "Add System"の"Copy docker compose"を押す
  2. 追加したいリモートサーバー上で、コピーした`docker-compose.yml`を保存する
  3. `sudo docker compose up -d`を実行
  4. 適当な名前と、リモートサーバーのIPアドレスを入力
     - `mDNS`のアドレスは認識しないようなので注意
  5. "Add server"を押す