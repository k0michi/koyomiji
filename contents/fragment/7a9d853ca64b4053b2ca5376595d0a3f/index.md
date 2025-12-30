# Dockerのボリュームをtarにアーカイブする

- ボリュームの中身をマウントし、中身を`tar`で固めて保存するコマンドの例
- ボリューム名は`docker volume ls`で確認する
- tar.gzにアーカイブする場合
  - バックアップ
    ```
    # docker run --rm \
      -v <アーカイブするボリューム名>:/source \
      -v $(pwd):/backup \
      alpine \
      tar czvf /backup/backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /source .
    ```
    - カレントディレクトリに`backup_<タイムスタンプ>.tar.gz`として作成される
  - 復元
    ```
    # docker run --rm \
      -v <復元先ボリューム名>:/dest \
      -v $(pwd):/backup \
      alpine \
      sh -c "find /dest -mindepth 1 -delete && tar xzvf /backup/<バックアップファイル名>.tar.gz -C /dest"
    ```
    - ボリュームの中を空にしたのち、アーカイブを展開
- tar.zstにアーカイブする場合
  - alpineにはデフォルトではzstdが入っていないため、fedoraなどのイメージを使う方が楽
  - バックアップ
    ```
    # docker run --rm \
      -v <アーカイブするボリューム名>:/source \
      -v $(pwd):/backup \
      fedora \
      tar cvf /backup/backup_$(date +%Y%m%d_%H%M%S).tar.zst --zstd -C /source .
    ```
  - 復元
    ```
    # docker run --rm \
      -v <復元先ボリューム名>:/dest \
      -v $(pwd):/backup \
      fedora \
      sh -c "find /dest -mindepth 1 -delete && tar xvf /backup/<バックアップファイル名>.tar.zst --zstd -C /dest"
    ```