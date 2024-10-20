# Blazorを使わずに、C#をWASMにコンパイルしブラウザ上で動かす

C#をWebAssemblyにコンパイルしてブラウザ上で動かしたいという場合は、Blazor WebAssemblyを使うのが一般的で、Microsoftも推奨している方法であるかと思います。

しかし、BlazorというのはWebアプリを作るためのフレームワークという側面が強く、単純にC#をWebAssemblyに変換して動かしたい、という場合には不必要なこともあります。例えば、ブラウザゲームを作る場合などです。

C#をブラウザ上で動かすにはBlazorを使わざるを得ない、というふうに私も思っていたのですが、実際はBlazorを使わずにC#のコードだけを動かす方法が(実験的にですが)用意されています。

使用している.NETは8.0.110です。

## workloadのインストール

.NET SDKをインストールし、`dotnet new list`とすると、Blazor WebAssembly Standalone App (blazorwasm)というテンプレートがあるかと思います。紛らわしいですが、これは、Blazor WebAssemblyのテンプレートであって、今回求めているものではありません。

Blazorを使わないWebAssemblyテンプレートとして、[WebAssembly Browser App](https://github.com/dotnet/runtime/tree/release/8.0/src/mono/wasm/templates/templates/browser) (wasmbrowser)というものが実験的に用意されています。しかし、SDKをインストールしただけでは、このテンプレートが現れません。

これらのテンプレートを利用するには、wasm-toolsとwasm-experimentalという二つのworkloadをインストールします:

```
$ dotnet workload install wasm-tools
$ dotnet workload install wasm-experimental
```

これにより、wasmbrowserというテンプレートが利用できるようになります。

## wasmbrowserテンプレート

では、wasmbrowserテンプレートを使ってみましょう。

```
$ dotnet new wasmbrowser
```

wasmbrowserテンプレートは、Blazorのものよりもずっとシンプルです。blazorwasmとは異なり、wwwroot/main.jsというJavaScriptで書かれたエントリポイントが存在しており、ここからC#のコードが呼び出されます。

```js
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

import { dotnet } from './_framework/dotnet.js'

const { setModuleImports, getAssemblyExports, getConfig } = await dotnet
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery()
    .create();

setModuleImports('main.js', {
    window: {
        location: {
            href: () => globalThis.window.location.href
        }
    }
});

const config = getConfig();
const exports = await getAssemblyExports(config.mainAssemblyName);
const text = exports.MyClass.Greeting();
console.log(text);

document.getElementById('out').innerHTML = text;
await dotnet.run();
```

C#の呼び出し方法は、この例からおおよそ分かるようになっています。ただAPIが明文化されていないので、詳しい使い方を知るにはソースコードを読む必要があります。

- [runtime/src/mono/wasm/runtime at release/8.0 · dotnet/runtime · GitHub](https://github.com/dotnet/runtime/tree/release/8.0/src/mono/wasm/runtime)

`dotnet run`でサーバーが立ち上がります。

## Ahead-of-timeコンパイルする

WebAssemblyのAhead-of-time(AOT)コンパイルもサポートされています。

AOTを有効にするには、(プロジェクト名).csprojの`<PropertyGroup>`内に

```
<RunAOTCompilation>true</RunAOTCompilation>
```

を書き加えます。

ただし、AOTコンパイルは`dotnet publish`した場合にだけ行われるようです。

## スレッドを有効にする

スレッドを有効化するには、`<PropertyGroup>`に

```
<WasmEnableThreads>true</WasmEnableThreads>
```

を書き加えます。これで、`Thread`を使うことができるようになります。内部的には、`WebWorker`で動くようです。

`dotnet run`では実行時エラーとなって動かなかった(バグ?)のですが、`dotnet publish`でビルドすれば動きました。`SharedArrayBuffer`を使えるように、Cross-Origin周りのヘッダをいじる必要があります。

```
$ dotnet publish && dotnet serve -h "Cross-Origin-Embedder-Policy:require-corp" -h "Cross-Origin-Opener-Policy:same-origin"
```

## 参考

- [runtime/src/mono/wasm/features.md at main · dotnet/runtime · GitHub](https://github.com/dotnet/runtime/blob/main/src/mono/wasm/features.md)