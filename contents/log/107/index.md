# React Router v7のプレリリースが来たよ

[React Router v7](https://reactrouter.com/dev/guides)のプレリリース版が10月4日にリリースされていました。これを書いている現在の最新版は、[7.0.0-pre.2](https://www.npmjs.com/package/react-router/v/7.0.0-pre.2)です。

React Routerといえば、もともとは文字通りReact向けに開発されたルーティングライブラリなわけです。現在のようにNext.jsが台頭する前は、クライアントサイドルーティングを実現するライブラリとしてメジャーだったのですが、v6になってからは、何方かと言えば[Remix](https://remix.run/)というフルスタックフレームワークの一部として開発されていた印象です。

が、今回のアップデートではReact RouterとRemixがついに併合され、React Router v7というフルスタックフレームワークになります。

- [Merging Remix and React Router | Remix](https://remix.run/blog/merging-remix-and-react-router)

React Router v7では、React Router v6、Remix v2からの破壊的変更は最小限に留められています。また、プリレンダリングやRSCといった新しい機能が追加されます。ただRSCに関しては、まだ開発途中のようです(ドキュメントがない)。プリレンダリングに関しても、まだバグが多い印象です。

## インストール

テンプレートがあるので、これを使うと簡単に使い始められます。`my-app`は任意のディレクトリ名です。

```
$ npx degit remix-run/react-router/templates/basic#dev my-app
```

お好みのパッケージマネージャで`install`します。

`dev`コマンドで、開発サーバーが立ち上がります。

```
$ cd my-app
$ pnpm install
$ pnpm run dev
```

## ルーティング

ルーティングについてはRemix v2から少し変更されて、`routes.ts`という一つのファイルに全てのルートの設定を記述するのがデフォルトになったようです。

- `index(componentFile)`: 親パスを`componentFile`で描画する。
- `route(path, componentFile)`: 親パスに`path`を繋げたパスを`componentFile`で描画する。
- `layout(componentFile, children)`: `children`の各ルートを、`componentFile`の`<Outlet />`のもとで描画する。パスは変化しない。
- `prefix(prefixPath, routes)`: `routes`の各ルートのパスの先頭に`prefixPath`を繋げる。

公式ドキュメントから持ってきた例です。

```tsx
import { type RouteConfig, route, index, layout, prefix } from "@react-router/dev/routes";

export const routes: RouteConfig = [
  index("./home.tsx"),
  route("about", "./about.tsx"),

  layout("./auth/layout.tsx", [
    route("login", "./auth/login.tsx"),
    route("register", "./auth/register.tsx"),
  ]),

  ...prefix("concerts", [
    index("./concerts/home.tsx"),
    route(":city", "./concerts/city.tsx"),
    route("trending", "./concerts/trending.tsx"),
  ]),
];
```

初見だと面食らいますが、これは次のような意味です。

- URL `/`へのリクエストは、コンポーネント`./home.tsx`によって描画される
- `/about`は、`./about.tsx`によって描画される
- `/login`は、`./auth/login.tsx`によって描画される。ただし、この描画結果は`./auth/layout.tsx`の`<Outlet />`に埋め込まれる
- `/register`は、`./auth/register.tsx`によって描画され、`/login`と同様のレイアウトがなされる
- `/concerts`は、`./concerts/home.tsx`によって描画される
- `/concerts/:city`は、`./concerts/city.tsx`によって描画される
- `/concerts/trending`は、`./concerts/trending.tsx`によって描画される

加えて、得られた描画結果は暗黙的に`app/root.tsx`の`<Outlet />`に埋め込まれます。このため、`app/root.tsx`は*ルート*ルート(*Root* Route)と呼ばれます(ややこしい)。

Remix v2時代のファイルベースのルーティングは`@react-router/fs-routes`によって[引き続きサポートされています](https://reactrouter.com/dev/guides/misc/file-route-conventions)。

```tsx
import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export const routes: RouteConfig = flatRoutes();
```

## レンダリング方式

React Router v7では、次の3つのレンダリング方式が使えます。

- Client Side Rendering
- Server Side Rendering
- Static Pre-rendering

レンダリング方式は、`vite.config.ts`で設定することができます。デフォルトではSSRになっているようです。

### Client Side Rendering

```ts
reactRouter({
  ssr: false
})
```

### Server Side Rendering

```ts
reactRouter({
  ssr: true
})
```

### Static Pre-rendering

プリレンダリングは`prerender`プロパティを指定するのですが、指定できるものがいくつかあります。

- `true`
  - 静的なルートをすべてプリレンダする。パスに`:param`などのパラメータがあるものはプリレンダされない
  ```ts
  reactRouter({
    prerender: true
  })
  ```
- 配列
  - 指定したルートのみをプリレンダする
  ```ts
  reactRouter({
    prerender: ['/', '/about']
  })
  ```
- 関数
  - プリレンダすべきパスを返す関数を指定する
  - 引数の`getStaticPaths`から、静的な全てのルートを配列として取得できる
  - 静的サイトジェネレータ的な使い方ができる
  ```ts
  reactRouter({
    async prerender({ getStaticPaths }) {
      let posts = await getPosts();
      let staticPaths = getStaticPaths();
      return staticPaths.concat(
        posts.map((post) => post.href)
      );
    },
  })
  ```

## 型定義の自動生成

React Router v7では、パスパラメータに安全にアクセスできるよう、ルートの型定義を自動生成することができるようになっています。TanStack Routerなどに触発された機能かと思います。

例えば、ファイルベースのルーティングをしていて`app/routes/blog.$pageID.tsx`というルートがあったとします。この時、`pageID`というパラメータが存在しますが、TypeScript上から`params['pageID']`が`string`であるという型情報を得ることができれば、`params['pageID']!`のような怪しい操作を回避することができ、安全になります。

型ファイルを生成するには、`react-router typegen`を使います。

```
$ pnpm react-router typegen
```

これにより、次のような型定義が自動生成されます。

```ts
// React Router generated types for route:
// routes/blog.$pageID.tsx

import * as T from "react-router/types"

export type Params = {
  pageID: string
}

type Route = typeof import("./blog.$pageID")

export type LoaderData = T.CreateLoaderData<Route>
export type ActionData = T.CreateActionData<Route>

export type LoaderArgs = T.CreateServerLoaderArgs<Params>
export type ClientLoaderArgs = T.CreateClientLoaderArgs<Params, Route>
export type ActionArgs = T.CreateServerActionArgs<Params>
export type ClientActionArgs = T.CreateClientActionArgs<Params, Route>

export type HydrateFallbackProps = T.CreateHydrateFallbackProps<Params>
export type ComponentProps = T.CreateComponentProps<Params, LoaderData, ActionData>
export type ErrorBoundaryProps = T.CreateErrorBoundaryProps<Params, LoaderData, ActionData>
```

この型定義をインポートすることで、次のように型安全なルートコンポーネントを書くことができるようになります。パスパラメータだけでなく、`loader`や`action`の返り値についても正しい型を得ることができます。

```tsx
import type * as Route from "./+types.blog.$pageID";
import { useLoaderData, useParams } from "react-router";

export const loader = async ({ }: Route.LoaderArgs) => {
  return 'foo';
}

export default function BlogPage() {
  const params = useParams() as Route.Params;
  const data = useLoaderData() as Route.LoaderData;

  return <>
    <div>First letter of pageID: {params.pageID[0]}</div>
    <div>First letter of loader data: {data[0]}</div>
  </>;
}
```

## 既知のバグ

まだReact Router v7はプレリリースの段階なので、結構な頻度でバグを踏みます。

- [\[Bug\]: (v7) Static Prerender Error: Cannot convert argument to a ByteString due to invalid character value · Issue #12160 · remix-run/react-router · GitHub](https://github.com/remix-run/react-router/issues/12160)
  - `loader`が非ASCII文字を含むデータを返す場合、プリレンダリングが失敗する
- [\[Bug\]: (v7) Cannot prerender resource routes · Issue #12196 · remix-run/react-router · GitHub](https://github.com/remix-run/react-router/issues/12196)
  - リソースルートをプリレンダすると失敗する

静的サイトジェネレータとして使う場合、この二つが結構厄介なので、パッチを(多少強引に)作りました。ご自由にお使いください。patch-packageなどで使えます。

- [Tentative fixes for React Router 7.0.0-pre.2 · GitHub](https://gist.github.com/k0michi/5f1ac7f4670a05f20a540ceb9f1b9c50)