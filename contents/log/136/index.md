# libuvでHello Worldする

[libuv](https://docs.libuv.org/en/v1.x/index.html)とは、Node.jsで用いられている非同期ランタイムであり、C言語で書かれている。libuvを用いることで、C/C++でもNode.jsのような非同期IOを実現することができる。

今回はlibuvの簡単な例として、"Hello World"を標準出力に非同期に書き込んでみる。使う言語はC++20、libuvのバージョンは1.51.0である。

ビルドシステムにはCMakeを用いる。`FetchContent_Declare`を用いるとリンクが簡単。

```cmake:CMakeLists.txt
cmake_minimum_required(VERSION 3.20)
project(libuv_hello CXX)

set(CMAKE_CXX_STANDARD 20)

include(FetchContent)

FetchContent_Declare(
  libuv
  GIT_REPOSITORY https://github.com/libuv/libuv.git
  GIT_TAG v1.51.0
)
FetchContent_MakeAvailable(libuv)

add_executable(libuv_hello main.cc)
target_link_libraries(libuv_hello PRIVATE uv)
```

libuvでHello Worldするには、3つの種類のオブジェクトを用意する必要がある:

- `uv_loop_t`: イベントループ
- `uv_buf_t`: バッファ
- `uv_fs_t`: コールバックに渡される構造体（ユーザデータを含む）

libuvを使うには、まずイベントループ（`uv_loop_t`）が必要である。イベントループは`uv_loop_init()`で自前で作ることも可能だが、libuvのデフォルトループを使うのが楽である。

```cpp
uv_loop_t *loop = uv_default_loop();
```

libuvでは、データは`uv_buf_t`というバッファでラップして取り扱う。この構造体はデータの開始地点へのポインタ（`base`）と長さ（`len`）を持つ。`uv_buf_t`は`uv_buf_init`で初期化するが、これはあくまで、引数として受け取った値をセットした構造体を返すだけなので、解放処理は必要ない。ただし、**`base`は、`uv_buf_t`を渡した関数のコールバックが呼び出されるまで解放してはならない**ことに注意。

```cpp
std::string message = "Hello World\n";
uv_buf_t buf =
    uv_buf_init(message.data(), static_cast<unsigned int>(message.size()));
```

最後に、`uv_fs_t`を用意する。これは、ファイルシステムへの操作関数において、コールバックにポインタとして渡されるものであり、1つのファイルシステム操作に対して1つ用意する。こちらも**関数のコールバックが呼び出されるまで解放してはならない**。今回は、特にユーザデータは渡さないので、単に`main`のローカル変数として置いておく:

```cpp
uv_fs_t writeReq;
```

ここまでのオブジェクトが用意できたら、ようやく`uv_fs_write`関数を呼び出すことができる。この関数はファイルにデータを非同期に書き込む関数である。非同期、というのがポイントで、**処理の完了はコールバックによって通知され、処理を待つことなく制御が即座に呼び出し元に戻る**。

`uv_fs_write`は次の引数を取る:

```cpp
UV_EXTERN int uv_fs_write(uv_loop_t* loop, // イベントループ 
                          uv_fs_t* req, // コールバックに渡される操作情報
                          uv_file file, // ファイルハンドル
                          const uv_buf_t bufs[], // バッファ。複数個渡すことができる
                          unsigned int nbufs, // バッファの個数
                          int64_t offset, // ファイルの位置。-1で現在の位置から書き進める
                          uv_fs_cb cb // コールバック
);
```

`uv_fs_write`では、`file`として`1`を指定することで標準出力に書き込むことができる（これと同様に、`0`は標準入力、`2`は標準エラー出力を指す）。これを用いて、先ほどのバッファを標準出力に書き込むには、次のようにする。コールバック内で、`uv_fs_req_cleanup`を呼び出してリクエスト情報を解放する必要がある点に注意する:

```cpp
uv_fs_write(loop, &writeReq, 1, &buf, 1, -1, [](uv_fs_t *req) {
  if (req->result < 0) {
    std::cerr << "Write error: " << uv_strerror(req->result) << std::endl;
  }

  uv_fs_req_cleanup(req);
});
```

最後に、`uv_run`でイベントループを開始する。`uv_run`にはいくつかのモードがあるが、`UV_RUN_DEFAULT`はアクティブな処理・リクエストが無くなるまで実行を行うモードである。これを実行することで初めて、前述の書き込み処理が実行される。

```cpp
uv_run(loop, UV_RUN_DEFAULT);
```

最終的なコードは次の通り:

```cpp:main.cc
#include <iostream>
#include <string>

#include <uv.h>

int main() {
  uv_loop_t *loop = uv_default_loop();

  std::string message = "Hello World\n";
  uv_buf_t buf =
      uv_buf_init(message.data(), static_cast<unsigned int>(message.size()));

  uv_fs_t writeReq;

  uv_fs_write(loop, &writeReq, 1, &buf, 1, -1, [](uv_fs_t *req) {
    if (req->result < 0) {
      std::cerr << "Write error: " << uv_strerror(req->result) << std::endl;
    }

    uv_fs_req_cleanup(req);
  });

  uv_run(loop, UV_RUN_DEFAULT);
  return 0;
}
```

CMakeでビルドして実行。何事もなければ、`Hello World`が出力される:

```
% cd build
% cmake .. && cmake --build . --parallel
% ./libuv_hello
Hello World
```