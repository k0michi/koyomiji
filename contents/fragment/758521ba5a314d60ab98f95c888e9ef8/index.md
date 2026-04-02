# exiftoolでGPS情報を削除する

- CLIから画像のEXIFを操作できるツールとして[exiftool](https://exiftool.org/)がある
- exiftoolで画像のGPS情報を削除するには、`-gps:all=`を指定する
- カレントディレクトリの全てのJPEGファイルのGPS情報を削除する例:
  ```
  % exiftool -gps:all= *.jpeg
  ```
  - なお、ファイルのバックアップが`(ファイル名)_original`として保存される
- バックアップが不要な場合は`-overwrite_original`を指定する:
  ```
  % exiftool -gps:all= -overwrite_original *.jpeg
  ```