# Node.jsのC++アドオンを作る【CMake.js】

- Node-APIを使ってC/C++のアドオンを作る、つまり、JavaScriptからC/C++を呼び出したい場合、以下の2つのいずれかのビルドシステムを用いる（少なくとも、[公式ドキュメント](https://nodejs.org/docs/latest/api/n-api.html)を読む限りはこの2つ）
  - [node-gyp](https://github.com/nodejs/node-gyp)
  - [CMake.js](https://github.com/cmake-js/cmake-js)
- node-gypが公式的なものだが、node-gyp固有のビルドスクリプトを用いるため、CMakeを使うことができない
- CMake.jsでは文字通り、CMakeを使ってNode.jsのC/C++アドオンを作ることができる
  - プロジェクトで既にCMakeを使っている場合、CMakeで管理されているライブラリを呼びたい場合に便利

## 使い方の例

- C++で、2つの値を受け取り和を返すアドオンを作るまでのステップ
- Node.js、CMake、コンパイラは既にインストールされていると仮定

1. npmプロジェクトを初期化
   ```
   % npm init
   ```
2. CMake.jsをインストール
   ```
   % npm install cmake-js
   ```
3. Node-APIはC言語のAPIである。C++で呼び出したい場合は追加で`node-addon-api`が必要となる
   ```
   % npm install node-addon-api
   ```
4. CMake.jsのREADMEを参考に、CMakeLists.txtを作成
   ```cmake:CMakeLists.txt
   cmake_minimum_required(VERSION 3.15...3.31)
   project(hello-addon)

   add_compile_definitions(NAPI_VERSION=4)

   set(SOURCE_FILES
       src/hello.cc
   )

   add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
   set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
   target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})
   target_link_libraries(${PROJECT_NAME} PRIVATE ${CMAKE_JS_LIB})
   target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_17)

   if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
     # Generate node.lib
     execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
   endif()
   ```
5. `package.json`に以下を追加:
   ```json:package.json
   "scripts": {
     "install": "cmake-js compile"
   },
   "binary": {
     "napi_versions": [
       7
     ]
   },
   ```
6. アドオンのソースコードを追加
   ```cpp:src/hello.cc
   #include <napi.h>
   
   Napi::Number Add(const Napi::CallbackInfo &info) {
     Napi::Env env = info.Env();
   
     if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
       Napi::TypeError::New(env, "Two numbers expected")
           .ThrowAsJavaScriptException();
       return Napi::Number::New(env, 0);
     }
   
     double arg0 = info[0].As<Napi::Number>().DoubleValue();
     double arg1 = info[1].As<Napi::Number>().DoubleValue();
     Napi::Number sum = Napi::Number::New(env, arg0 + arg1);
   
     return sum;
   }
   
   Napi::Object Init(Napi::Env env, Napi::Object exports) {
     exports.Set(Napi::String::New(env, "add"), Napi::Function::New(env, Add));
     return exports;
   }
   
   NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
   ```
7. コンパイル
   ```
   % npm run install
   ```
   何事もなければ、バイナリが`build/Release/{アドオン名}`に生成される

- Node.jsからアドオンを呼び出す（CommonJSの場合）
  ```js:main.js
  const addon = require('./build/Release/hello-addon');

  console.log(addon.add(3, 5)); // 8
  ```
- ESModuleの場合、そのまま`import`することはできない。`createRequire`する必要がある
  ```js:main.mjs
  import { createRequire } from 'module';
  const require = createRequire(import.meta.url);
  const addon = require('./build/Release/hello-addon');

  console.log(addon.add(3, 5)); // 8
  ```