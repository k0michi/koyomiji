# CMakeでlibpngにリンクする

- 環境
  - MacBook Pro (2021)
  - macOS 15.1.1
  - CMake 3.31.5
- CMakeで`FetchContent_Declare`を使ってlibpngをリンクする試み
- libpngはzlibに依存しているため、まずはzlibを持ってくる必要がある
  ```cmake
  FetchContent_Declare(
    zlib
    GIT_REPOSITORY https://github.com/madler/zlib.git
    GIT_TAG 5a82f71ed1dfc0bec044d9702463dbdf84ea3b71
    OVERRIDE_FIND_PACKAGE
  )
  FetchContent_MakeAvailable(zlib)
  ```
  - 最新リリースはv1.3.1だが、v1.3.1だと`ZLIB::ZLIB`として別名定義されないためエラーとなる。そのためdevelopの最新コミットを指定している
  - `OVERRIDE_FIND_PACKAGE`を指定しているのは、libpngの`CMakeLists.txt`がzlibを`find_package`しているため。`OVERRIDE_FIND_PACKAGE`を指定することで、`find_package`がFetchしたリポジトリを参照するようになる
  - `OVERRIDE_FIND_PACKAGE`は、CMake 3.24以降でのみ使うことができる
- zlibのFetchの後で、libpngをFetchする
  - libpngはCMakeLists.txtを提供しているものの、ビルドプロセスに問題がある
  - libpngのビルドプロセスには、`<zlib.h>`を参照してzlibのバージョン情報を取得するなどの処理が組み込まれている。これは、ビルド時に`pnglibconf.h`として生成される
    - [libpng/scripts/pnglibconf/pnglibconf.dfa](https://github.com/pnggroup/libpng/blob/libpng18/scripts/pnglibconf/pnglibconf.dfa)
  - しかしこのpnglibconfは、どうやらシステム側の`<zlib.h>`を参照しているようで、Fetchしたzlibが無視されてしまうという問題がある。これにより、ビルドエラーが発生する:
    ```
    .../build/_deps/libpng-src/pngpriv.h:1027:4: error: The include path of <zlib.h> is incorrect
     1027 | #  error The include path of <zlib.h> is incorrect
          |    ^
    ```
  - しかしこの`pnglibconf.h`の生成は、実はスキップしてもビルドが可能である。スキップされた場合には、`pnglibconf.h.prebuilt`が使われる。特に、システムにawkが入っていない場合は、生成がスキップされる:
    ```cmake
    if(PNG_LIBCONF_HEADER STREQUAL "")
      # No custom configuration header file has been specified, so we build it
      # from our DFA files and (optionally) out of the user-supplied DFA file.
      # Find an AWK language processor.
      # Start with specific AWK implementations like gawk and nawk, which are
      # known to work with our scripts, then fall back to the system awk.
      find_program(AWK NAMES gawk nawk awk)
      if(AWK)
        message(STATUS "Found AWK program: ${AWK}")
      else()
        message(STATUS "Could not find an AWK-compatible program")
      endif()
    endif()

    # Include the internal module PNGCheckLibconf.cmake
    include("${CMAKE_CURRENT_SOURCE_DIR}/scripts/cmake/PNGCheckLibconf.cmake")

    if(NOT PNG_LIBCONF_HEADER STREQUAL "")
      # Configure libpng with the user-defined pnglibconf.h file.
      png_check_libconf(HEADER "${PNG_LIBCONF_HEADER}")
      configure_file("${PNG_LIBCONF_HEADER}"
                    "${CMAKE_CURRENT_BINARY_DIR}/pnglibconf.h"
                    @ONLY)
      add_custom_target(png_genfiles)
    elseif(NOT AWK)
      # No AWK program available to generate pnglibconf.h.
      # Configure libpng with pnglibconf.h.prebuilt.
      png_check_libconf(HEADER "${PNG_LIBCONF_HEADER_PREBUILT}")
      configure_file("${PNG_LIBCONF_HEADER_PREBUILT}"
                    "${CMAKE_CURRENT_BINARY_DIR}/pnglibconf.h"
                    @ONLY)
      add_custom_target(png_genfiles)
    else()
      ...
    endif()
    ```
  - システム側にawkがあるかどうかに関わらず、`pnglibconf.h`の生成をスキップするには、次のようにして`find_program`の検索を防止し、常に`pnglibconf.h.prebuilt`が使われるようにすればよい:
    ```cmake
    set(AWK "OFF")
    FetchContent_Declare(
      libpng
      GIT_REPOSITORY https://github.com/pnggroup/libpng.git
      GIT_TAG v1.6.51
    )
    FetchContent_MakeAvailable(libpng)
    unset(AWK)
    ```
    - これは、`find_program`の検索が、変数が
      - 未定義であるとき または
      - `NOTFOUND`であるとき または
      - `-NOTFOUND`で終わるとき

      にのみ行われるという仕様を用いている
    - find_program — CMake 4.2.0 Documentation
      [https://cmake.org/cmake/help/latest/command/find_program.html](https://cmake.org/cmake/help/latest/command/find_program.html)