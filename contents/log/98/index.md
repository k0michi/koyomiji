# docker compose restartは、compose.ymlへの変更を反映しない

Docker Composeの`restart`コマンドは、`compose.yml`に定義されているサービスの一部または全てを再起動するコマンドであるが、この`restart`では、起動後に`compose.yml`が変更されていたとしても、その内容を**反映しない**。

- [docker compose restart | Docker Docs](https://docs.docker.com/reference/cli/docker/compose/restart/)

このことについては、公式のドキュメント内にも注意書きがある。systemctlなどのノリで、`restart`なのだから、`compose.yml`が再読み込みされ、新しい設定が反映されるだろうと思い込んでいるとハマるので、注意されたし。

ではどうすれば設定が反映されるかというと、単純に`up`しなおせば良い。

```
$ sudo docker compose up -d
```

- [How to implement changes made to docker-compose.yml to detached running containers - Stack Overflow](https://stackoverflow.com/questions/54114045/how-to-implement-changes-made-to-docker-compose-yml-to-detached-running-containe)