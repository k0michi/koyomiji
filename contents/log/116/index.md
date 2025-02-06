# v22.0.0でfs.globが追加されていた【Node.js】

Node.jsには長らくglob、ワイルドカードに一致するファイルを列挙する機能が標準で用意されていなかったので、[glob](https://www.npmjs.com/package/glob)といったnpmパッケージを用いるのが普通だった。が、Node.js v22.0.0で標準APIに

- `fs.glob(pattern[, options], callback)`
- `fsPromises.glob(pattern[, options])`

が追加されているのを見つけた。ただし、v23.7.0の時点ではexperimentalとなっていることに注意。`glob`が標準APIに追加されたことで、ファイルを一括で処理するスクリプトを記述しやすくなるので嬉しい。

## Promise版

二つの引数を受け取る。

- `fsPromises.glob(pattern[, options])`
  - `pattern`: `string`または`string[]`。`string[]`の場合、いずれかのパターンにマッチするようなパスを列挙する
  - `options`: `Object`または`undefined`
    - `cwd`: ワーキングディレクトリ。省略した場合`process.cwd()`
    - `exclude`: 関数または`string[]`。ただし、`string[]`はv23.7.0以降のみ。除外するパスのパターンを指定できる
    - `withFileTypes`: `boolean`。`true`にした場合、パスが`Dirent`として返る。そうでなければ`string`が返る

戻り値は`AsyncIterator`。具体的には`withFileTypes == false`であるとき`AsyncIterator<string>`、そうでないとき`AsyncIterator<Dirent>`。

### 実行例

```js
import * as fsPromises from 'node:fs/promises';

for await (const entry of fsPromises.glob('**/*.mjs')) {
  console.log(entry);
}
```

```
% node glob.mjs
(node:39461) ExperimentalWarning: glob is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
glob.mjs
dir/blank.mjs
dir/blank2.mjs
```

```js
import * as fsPromises from 'node:fs/promises';

// v23.7.0以降
for await (const entry of fsPromises.glob('**/*.mjs', { exclude: ['dir/**/*.mjs'] })) {
  console.log(entry);
}
```

```
% node glob.mjs
(node:52435) ExperimentalWarning: glob is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
glob.mjs
```


```js
import * as fsPromises from 'node:fs/promises';

for await (const entry of fsPromises.glob('**/*', { withFileTypes: true })) {
  console.log(entry);
}

```

```
% node glob.mjs
(node:42449) ExperimentalWarning: glob is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
Dirent {
  name: 'blank.txt',
  parentPath: '/Users/k0michi/Local/Playground/glob',
  [Symbol(type)]: 1
}
Dirent {
  name: 'dir',
  parentPath: '/Users/k0michi/Local/Playground/glob',
  [Symbol(type)]: 2
}
Dirent {
  name: 'glob.mjs',
  parentPath: '/Users/k0michi/Local/Playground/glob',
  [Symbol(type)]: 1
}
Dirent {
  name: 'blank.mjs',
  parentPath: '/Users/k0michi/Local/Playground/glob/dir',
  [Symbol(type)]: 1
}
Dirent {
  name: 'blank2.mjs',
  parentPath: '/Users/k0michi/Local/Playground/glob/dir',
  [Symbol(type)]: 1
}
```

## コールバック版

- `fs.glob(pattern[, options], callback)`

Promise版とおおよそ同じだが、結果がコールバック引数として、`string[]`で得られる点だけ異なる。

結果が一括で与えられるので、ファイル数が多い場合はPromise版よりもメモリ消費が大きいかもしれない。

### 実行例

```js
fs.glob('**/*.mjs', (err, matches) => {
  console.log(matches);
});
```

```
% node glob.mjs
(node:53159) ExperimentalWarning: glob is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[ 'glob.mjs', 'dir/blank.mjs', 'dir/blank2.mjs' ]
```