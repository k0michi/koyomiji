# Gitで空のInitial commitを作る

- まだフォルダ構成とかは決まってないけど、とりあえずリポジトリを初期化したい場合がある
- `git commit`はデフォルトでは変更がない場合はコミットを作らせてくれない:
  ```
  % git init
  Initialized empty Git repository in .../.git/
  % git commit
  On branch main

  Initial commit

  nothing to commit (create/copy files and use "git add" to track)
  ```
- `--allow-empty`オプションを使うと、この挙動を回避して空のInitial commitを作ることができる:
  ```
  % git commit -m "Initial commit" --allow-empty
  [main (root-commit) f03a945] Initial commit
  ```
- `--allow-empty`はInitial commitを作る時に限らずいつでも、空コミットを作るために使うことができる