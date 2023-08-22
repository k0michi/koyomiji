# Windows上でTintをビルドする時の覚書

[Tint](https://dawn.googlesource.com/tint/)というのはGoogleによって開発されているWGSL(WebGPU Shader Language)とSPIR-Vの相互変換を行うことができるコンパイラーなのですが、TintをWindows上でビルドする際にいくつかの問題に遭遇したので、その対処法を記しておこうと思います。

## "Python Error"

これは`gclient sync`を実行中に発生します。具体的には、以下のようなエラーメッセージが表示され、`gclient sync`が失敗するというものです:

```
________ running 'download_from_google_storage --no_resume --no_auth --bucket chromium-clang-format -s buildtools/win/clang-format.exe.sha1' in 'C:\Users\k0michi\Local\tint\.'
Python Error: Command 'download_from_google_storage --no_resume --no_auth --bucket chromium-clang-format -s buildtools/win/clang-format.exe.sha1' returned non-zero exit status 9009 in C:\Users\k0michi\Local\tint\.
Python
```

これはどうやら、システム上にすでにclang-formatやPythonが入っていることが原因のようです。というのも、depo_toolsには独自のclang-format、Pythonが含まれているためです。

なので、環境変数`PATH`書き換えて、depo_toolsのパスが、既にインストール済みの実行ファイルのパスよりも先に来るようにします。一番最初にdepo_toolsが来るようにするのが楽でしょう:

```
> set path=C:\Users\k0michi\Local\depot_tools;%path%
```

また、depot_toolsの影響範囲(clang-formatが使えなくなる等)を考えると、depot_toolsを`PATH`に追加するのはビルド時のみにした方が良さそうです。

## "No downloadable toolchain found"エラー

前述の問題を解決し、再度実行すると、次は下記のエラーが出現しました。

```
No downloadable toolchain found. In order to use your locally installed version of Visual Studio to build Chrome please set DEPOT_TOOLS_WIN_TOOLCHAIN=0.
For details search for DEPOT_TOOLS_WIN_TOOLCHAIN in the instructions at https://chromium.googlesource.com/chromium/src/+/HEAD/docs/windows_build_instructions.md
```

これはChromiumのビルドなどでも発生するようです。エラー文に示されている通り、`DEPOT_TOOLS_WIN_TOOLCHAIN`を設定すればよいです。

```
> set DEPOT_TOOLS_WIN_TOOLCHAIN=0
```

これで、`gclient sync`が正常に完了するはずです。

## ninjaのエラー

次に、CMake + Ninjaでのビルドを試みましたが、今度は次のエラーに見舞われます:

```
C:\Users\k0michi\Local\tint\out\Debug>cmake -GNinja ..\..
CMake Error at CMakeLists.txt:17 (project):
  Running

   'C:/Users/k0michi/Local/depot_tools/ninja' '--version'

  failed with:

   %1 は有効な Win32 アプリケーションではありません。


CMake Error: CMAKE_C_COMPILER not set, after EnableLanguage
CMake Error: CMAKE_CXX_COMPILER not set, after EnableLanguage
-- Configuring incomplete, errors occurred!
```

これはどうやら、depot_toolsの方のninjaを使おうとしていることが原因のようです。これを解決するためには、depot_toolsを`PATH`から消して、本来のninjaが使えるようにした上で、**`out/Debug/CMakeCache.txt`を削除します**。キャッシュを削除しないと、depot_toolsが`PATH`になくても同じエラーとなります。

ここまでの問題を取り除いてようやく、Windows上でTintをビルドすることができました。