# GCCの`--coverage`はデフォルトではスレッドセーフではない

- 環境
  - GitHub Actions上の`ubuntu-latest`
  - GCC 13.3.0
- C++でスレッドを使うテストを書いたところ、CIで以下のエラーが出た:
  ```
  (WARNING) Unrecognized GCOV output for /home/runner/work/augatgatf/augatgatf/internal/keel/test/test_intrusive_ptr.cc
      branch  1 taken -122 (fallthrough)
    This is indicative of a gcov output parse error.
    Please report this to the gcovr developers
    at <https://github.com/gcovr/gcovr/issues>.
  (WARNING) Exception during parsing:
    NegativeHits: Got negative hit value in gcov line 'branch  1 taken -122 (fallthrough)' caused by a bug in gcov tool, see https://gcc.gnu.org/bugzilla/show_bug.cgi?id=68080. Use option --gcov-ignore-parse-errors with a value of negative_hits.warn, or negative_hits.warn_once_per_file.
  (ERROR) Exiting because of parse errors.
    You can run gcovr with --gcov-ignore-parse-errors
    to continue anyway.
  ```
  - カバレッジの値が負の値になっており、GCOVがレポートのパースに失敗している
- カバレッジは次のオプションで取得していた:
  ```cmake
  target_compile_options(coverage_config INTERFACE
    -O0
    -g
    --coverage
  )
  # ...
  target_link_libraries(keel PUBLIC coverage_config)
  ```
- Gemini 3 Proに聞いたところ、`-fprofile-update=atomic`オプションを使うことを提案された
  - `-fprofile-update`はデフォルトでは、`-pthread`があるときは`prefer-atomic`、ないときは`-single`である
  - `-fprofile-update=atomic`をオプションに加えると、無事エラーは解消された
    ```cmake
    target_compile_options(coverage_config INTERFACE
      -O0
      -g
      --coverage
      -fprofile-update=atomic # 追加
    )
    ```
- ただし、GCC公式によれば、`-fprofile-update=atomic`があったとしても全てのスレッドを`join`していない場合、レポートが壊れる可能性があるとのことなので、注意を要する
  - [Instrumentation Options (Using the GNU Compiler Collection (GCC))](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html)
    > **Warning:** When an application does not properly join all threads (or creates an detached thread), a profile file can be still corrupted. 
- おそらくより良い解決方法は、スレッドを使っている場合に必ず`Threads::Threads`とリンクして`-pthread`が付与されるようにすることだが、CMakeListsの大幅な書き換えが必要であるため未検証
  - [FindThreads — CMake 4.2.1 Documentation](https://cmake.org/cmake/help/latest/module/FindThreads.html)