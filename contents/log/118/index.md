# UbuntuでマルチキャストDNS(mDNS)を使う

LAN内であれば、[マルチキャストDNS](https://ja.wikipedia.org/wiki/%E3%83%9E%E3%83%AB%E3%83%81%E3%82%AD%E3%83%A3%E3%82%B9%E3%83%88DNS)を用いることによって、DNSサーバーを構築せずとも`hostname.local`のようなホスト名からなるドメインを、対応するローカルIPアドレス(`192.168.xxx.yyy`)に解決することが可能です。マルチキャストDNSを用いると、動的にIPアドレスが変わるような場合でも、ホスト名さえ覚えておけばアドレスを解決することができるため便利です。

macOSではかなり昔のバージョン(Mac OS X 10.2-)からBonjourが同梱されており、デフォルトで使うことができます。また、最近のWindowsでも標準で有効になっているようです。

Linuxにおいては[Avahi](https://avahi.org/)と呼ばれるマルチキャストDNSの実装が存在しますが、Ubuntu Server 24.04.2においてはデフォルトでインストールされないようです。

UbuntuでAvahiをインストールするには、`avahi-daemon`をインストールすれば良いです。`systemctl`で有効にします。

```
$ sudo apt install -y avahi-daemon
$ sudo systemctl enable avahi-daemon
```

有効にしたのち、一応再起動。

```
$ sudo reboot
```

これにより、LANの他のデバイスから`(ホスト名).local`として到達可能になるはずです。

```
% ping houshou.local
```