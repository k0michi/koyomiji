# macOSでカーソル速度を細かく調整する

- 環境
  - macOS 26.4.1
- macOS標準の設定画面では、カーソルの速度を離散的な値からしか選ぶことができない
  - 片方では速すぎるが、片方では遅い、という場合が生じる
- `defaults`コマンドを使うことで、より細かなカーソル速度の調整を行える
- 現在のカーソル速度を確認する:
  ```
  % defaults read -g com.apple.mouse.scaling
  0.5
  ```
  - `-g`は`NSGlobalDomain`を意味する。`NSGlobalDomain`または`-globalDomain`でも同様の結果となる
- カーソル速度を変更するには`write`を使う。`0.375`にする場合:
  ```
  % defaults write -g com.apple.mouse.scaling 0.375
  ```
- **設定の反映には再ログインが必要。**