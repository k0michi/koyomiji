# ICU4Cを簡単にリンクできるCMakeスクリプト書いた

## 動機

ICU4CはC/C++でUnicodeを扱うためのデファクトスタンダードライブラリです。素のC/C++にはUnicodeを扱う機能がない（！）ため、このようなライブラリはアプリケーション開発では必須です。

しかし、ビルドがとても複雑で難しいことで有名です（？）。この複雑さは、ICU4C自身にICU4Cが用いるUnicodeデータベース（icudata）を生成するためのプログラムが含まれていることに起因しています。このデータ生成プログラム（[pkgdata](https://github.com/unicode-org/icu/blob/e945059cbf47e2ef7898472281c59b1c63d37607/icu4c/source/tools/pkgdata/pkgdata.cpp)）は、スクリプト言語ではなくC++で記述されているのです。従って、ICU4Cをコンパイルするためには、このC++プログラムをコンパイルし、実行し、データを生成する必要があるのです。

このように先にプログラムをコンパイルして実行しなくてはならない関係上、クロスコンパイル時に問題が生じます。クロスコンパイルでは、ホスト側、すなわちコンパイルを実行中のアーキテクチャと、ターゲットのアーキテクチャが異なるため、pkgdataなどのツールをコンパイルする時はホストのアーキテクチャに対応したバイナリを吐き出させ、それを実行し、ターゲットのアーキテクチャのバイナリをコンパイルする、という2段階でビルドする必要が生じます。

また、ICU4CはCMakeでのビルドが公式ではサポートされていません。加えて、ICU4Cのビルドスクリプトはかなり複雑怪奇であるため、CMakeプロジェクトからICUを使おうと思った場合のハードルは非常に高いです。私としては、CMakeの`FetchContent`で手軽にライブラリをリンクできるのが好きなので、`FetchContent`でリンクできるようにICU4Cのビルドをどうにかしなくてはなりませんでした。

## 作ったもの

そこで、ICU4CをCMakeで手軽にリンクできるCMakeスクリプトを作りました。

- [k0michi/icu-portable](https://github.com/k0michi/icu-portable)

このスクリプトを用いると、ICU4Cへのリンクが`FetchContent`だけで完結できます。とても簡単。

```cmake
include(FetchContent)

FetchContent_Declare(
    icu_portable
    GIT_REPOSITORY "https://github.com/k0michi/icu-portable.git"
    GIT_TAG        "main"
)

FetchContent_MakeAvailable(icu_portable)

target_link_libraries(your_target PRIVATE ICU::uc ICU::i18n ICU::io)
```

## 仕組み

このスクリプトのポイントは、ビルド済みicudataを公式GitHub Releaseからfetchし、C言語として埋め込めるようにバイト列を変換、icudataとしてビルドするという"ズル"をしていることにあります。つまり、公式のビルド手順を無視して、icudataのビルドをスキップしているのです。

しかし、この"ズル"はほとんどの場合妥当なはずです。ICU4CをCMakeプロジェクトにリンクしたい場合において、Unicodeのデータベースのビルド自体に手を加えたいということは相当稀ではないでしょうか。なので、単にビルド済みのデータを使えば良くない？というのがこのスクリプトのアイデアです。