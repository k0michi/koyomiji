# macOSのDockerでRocky Linuxを動かしてみる

最近Dockerを使い始めたので、Rocky Linuxを動かすまでのメモです。

## インストール

今回はDocker Desktopをインストールします。Docker Desktopのインストール方法に関しては、[Get Docker | Docker Documentation](https://docs.docker.com/get-docker/)に詳しく載っていますが、macOSの場合はHomebrewでインストールすることもできます。

紛らわしいですが、Homebrewには[Formulaのdocker](https://formulae.brew.sh/formula/docker)と、[Caskのdocker](https://formulae.brew.sh/cask/docker)が存在します。Docker Desktopをインストールするには、Caskの方を指定する必要があります。Formulaの方はDockerのCLIクライアントのようです。

```
% brew install --cask docker
```

インストールが完了したら、Applications内にあるDocker.appを起動します。CLIからDockerを使う場合でも、このアプリケーションを立ち上げておきます。

## コンテナを動かす

[Docker Hub](https://hub.docker.com/)からコンテナイメージを探します。Rocky Linuxの場合は公式のイメージがあります。`docker pull`コマンドでイメージを取得することができます。イメージは、`(イメージ名):(タグ)`のように指定します。タグを省略すると、デフォルトで`latest`となりますが、Rocky Linuxの場合は`latest`タグが無いのでエラーになります。

```
% docker pull rockylinux:9
```

次に`docker run`コマンドでコンテナを起動します。コマンドライン上から操作する場合には、`-it`オプションを与えます。(`-i`は標準入力を開くオプション、`-t`は仮想TTYを割り当てるオプションのようです。)

```
% docker run -it rockylinux:9
[root@9132f9b19b4b /]#
```

これで、コンテナを起動することができました。実際に、Rocky Linuxの環境となっていることが確認できます。

```
[root@9132f9b19b4b /]# cat /etc/rocky-release
Rocky Linux release 9.1 (Blue Onyx)
```

コンテナの終了は`exit`コマンドで行えます。

## 作成したコンテナを起動する

作成したコンテナを再度起動したい場合は、`docker ps -a`でコンテナのIDを確認し、IDを`docker start`の引数に与えることで再び起動することができます。

```
% docker start -i 9132f9b19b4b
```

## 異なるCPUアーキテクチャのイメージを使う

Dockerは、CPUのエミュレーションも行うことができます。これにより、例えばARMベースのApple M1チップ上で、x86_64のコンテナを動かすことができます。`--platform`オプションを指定します。

Rosetta 2が入っていることが前提です。

```
% arch
arm64
% docker run -it --platform linux/amd64 rockylinux:9 
[root@c12c7735ab87 /]# arch
x86_64
```

arm64上でx86_64の環境をエミュレートできていることがわかります。エミュレーションは、内部的にはQEMUによって行われているようです。

このように、Dockerを使うことで、macOS上で手軽に、多様なLinux環境を使うことができます。今後は独自コンテナの作成方法なども調べてみようと思います。