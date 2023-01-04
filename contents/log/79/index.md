# Python向けパッケージマネージャ Poetry を試す

Pythonに触れる度に、毎回どのパッケージマネージャ・仮想環境を使ってプロジェクトの環境を構築すれば良いのかがわからず躓いてしまうのですが、[Poetry](https://python-poetry.org/)なる新しいパッケージマネージャが登場しているようなので使ってしました。私はいつもnpmやYarnを使っているのですが、Poetryのコマンドラインインターフェースはそれらに近い印象なので、気に入っています。依存関係がTOMLファイルに記述されるのも良いです。

[公式のインストール手順](https://python-poetry.org/docs/)では、シェルスクリプトからインストールしているようですが、brewでもインストールすることができました。

```bash
% brew install poetry
```

で、インストールすることができます。パスも自動で通るようです。

```bash
% poetry --version
Poetry (version 1.3.1)
```

## コマンド

よく使うであろう幾つかのコマンドです。これら以外にも、パッケージをパブリッシュするための機能もあるようです。

### new

指定したディレクトリに新しいプロジェクトを生成します。
```bash
% poetry new <project_name>
```

### init

現在のディレクトリに`pyproject.toml`を作成します。対話的なインターフェースです。
```bash
% poetry init
```

### add

指定したパッケージをプロジェクトにインストールします。
```bash
% poetry add <package_name>
```

### remove

指定したパッケージをプロジェクトから削除します。
```bash
% poetry remove <package_name>
```

### install

プロジェクトの`pyproject.toml`に記されたパッケージをインストールします。
```bash
% poetry install
```

### update

プロジェクトの`pyproject.toml`の全ての依存パッケージをアップデートします。指定したパッケージだけをアップデートすることもできます。
```bash
% poetry update
% poetry update <package_name>
```

### show

インストールされたパッケージの情報を表示します。パッケージ名を指定すると、詳細な情報が表示されます。
```bash
% poetry show
% poetry show <package_name>
```

### run

プロジェクトのvirtualenv環境内でコマンドを実行します。以下の例では、main.pyを実行します。
```bash
% poetry run python main.py
```
`pyproject.toml`に記述されているスクリプトを実行することもできるようです。

### search

パッケージを検索します。
```bash
% poetry run <keyword>
```

### list

Poetryのコマンドを一覧表示します。
```bash
% poetry list
```
