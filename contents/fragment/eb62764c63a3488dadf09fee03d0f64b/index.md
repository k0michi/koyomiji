# git cleanの使い方

- gitでtrackされていないファイルやignoreされているファイルを一括で消すコマンド
- `-n`でdry run、削除対象のファイルを確認することができる
- **trackされていない**ファイルを全て消す
  ```
  % git clean -fd
  ```
  - `-f` 強制的に消す（force）
  - `-d` ディレクトリも消す
- **ignoreされている**ファイルを全て消す
  ```
  % git clean -Xfd
  ```
  - `-X` ignoredだけを対象とする
- **trackされていない**ファイルと**ignoreされている**ファイルを全て消す
  ```
  % git clean -xfd
  ```
  - `-x` untracked、ignoredを対象とする