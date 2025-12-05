# QuickJS-NGでC++からJavaScriptを実行する

- Fabrice Bellard氏らによる軽量JavaScriptエンジン[QuickJS](https://bellard.org/quickjs/)のコミュニティフォークが[QuickJS-NG](https://quickjs-ng.github.io/quickjs/)
  - いずれもC言語で書かれている
  - ES2023など新しめの言語仕様も網羅されている
- QuickJS-NGではCMakeLists.txtが提供されているため、`FetchContent`で導入可能
  ```cmake:CMakeLists.txt
  cmake_minimum_required(VERSION 3.20)
  project(quickjs_hello CXX)

  set(CMAKE_CXX_STANDARD 20)

  include(FetchContent)

  FetchContent_Declare(
    quickjs
    GIT_REPOSITORY https://github.com/quickjs-ng/quickjs
    GIT_TAG         v0.11.0
  )

  FetchContent_MakeAvailable(quickjs)

  add_executable(quickjs_hello main.cc)
  target_link_libraries(quickjs_hello PRIVATE qjs)
  ```

- JavaScriptからC関数を呼び出す例
  ```cpp:main.cc
  JSValue print(JSContext *ctx, JSValueConst this_val, int argc,
                JSValueConst *argv) {
    for (int i = 0; i < argc; ++i) {
      const char *str = JS_ToCString(ctx, argv[i]);
      if (str) {
        std::cout << str;
        JS_FreeCString(ctx, str);
      }
      if (i < argc - 1) {
        std::cout << " ";
      }
    }
    std::cout << std::endl;
    return JS_UNDEFINED;
  }

  int main() {
    JSRuntime *rt = JS_NewRuntime();

    if (!rt) {
      std::cerr << "Failed to create QuickJS runtime" << std::endl;
      return 1;
    }

    JSContext *ctx = JS_NewContext(rt);

    if (!ctx) {
      std::cerr << "Failed to create QuickJS context" << std::endl;
      JS_FreeRuntime(rt);
      return 1;
    }

    JSValue global = JS_GetGlobalObject(ctx);
    auto printFunc = JS_NewCFunction(ctx, print, "print", 1);
    JS_SetPropertyStr(ctx, global, "print", printFunc);
    JS_FreeValue(ctx, global);

    const char *jsCode = R"(
      print('Hello', 'World!');
  )";

    JSValue result =
        JS_Eval(ctx, jsCode, strlen(jsCode), "<input>", JS_EVAL_TYPE_GLOBAL);

    if (JS_IsException(result)) {
      std::cerr << "JavaScript evaluation failed" << std::endl;
      JS_FreeValue(ctx, result);
      JS_FreeContext(ctx);
      JS_FreeRuntime(rt);
      return 1;
    }

    JS_FreeValue(ctx, result);
    JS_FreeContext(ctx);
    JS_FreeRuntime(rt);
    return 0;
  }
  ```