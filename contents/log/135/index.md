# PythJSON: PythonのためのJSONサブセット

## PythonとJSONは似ている

PythonとJSONは似ている——と言っても、どちらも名前が"on"で終わる、という話をしているわけではない。Pythonのオブジェクト記法は、JSONに驚くほど似ている:

```py
{
  "dict": {},
  "list": [],
  "str": "",
  "int": 0,
  "float": 0.0,
  "bool": True,
  "none": None
}
```

つまり、JSONのサブセットをうまく作れば、Pythonとしても、JSONとしても、JavaScriptとしても正当なデータ交換フォーマットを作れるのでは？というのを調べるのが今回の目的。

## 非互換なところ

といっても、すべてのJSONデータがPythonのソースコードとして正当であるというわけではない。私が知る限り、4つの非互換な点がある。

1つ目は、上の例からも分かる通り、Pythonでは、ブール値のリテラルは`True`/`False`である。一方JSONでは、`true`/`false`であるから、ブール値には互換性がない。

2つ目は、1つ目同様に、「値がないことを表す」値のリテラルは、Pythonでは`None`だが、JSONでは`null`であるため、これに関しても互換性がない。

3つ目は、文字列中の`/`がエスケープ可能か？というものである。Pythonでは、`/`はエスケープすることができない。`/`をエスケープしようとすると、`\/`というエスケープシーケンスがないため、`\`はそのまま文字列に含まれる:

```py
>>> "\/"
'\\/'
```

一方、JSON（JavaScript）では`/`をエスケープ可能であるため、`\`は文字列に含まれない:

```js
> "\/"
'/'
```

4つ目は、先頭の空白文字である。具体的には、JSONでは、次のように最初の非空白文字の前に空白文字が含まれていても問題ない:

```json
  {}
```

しかし、このような先頭の空白文字は、Pythonでは許容されない:

```
% echo "  {}" | python3
  File "<stdin>", line 1
    {}
IndentationError: unexpected indent
```

## 完成形

以上のPythonとの非互換性を解消した、PythJSONフォーマットを次のようにMcKeeman Formで定義する。

[JSONのMcKeeman Form](https://www.json.org/json-en.html)からの変更点は次の通り:

- `"true"`/`"false"`/`"null"`を削除
- `'/'`を`escape`から削除
- `json`の子を`value ws`に変更

```
json
   value ws

value
   object
   array
   string
   number

object
    '{' ws '}'
    '{' members '}'

members
    member
    member ',' members

member
    ws string ws ':' element

array
    '[' ws ']'
    '[' elements ']'

elements
    element
    element ',' elements

element
    ws value ws

string
    '"' characters '"'

characters
    ""
    character characters

character
    '0020' . '10FFFF' - '"' - '\'
    '\' escape

escape
    '"'
    '\'
    'b'
    'f'
    'n'
    'r'
    't'
    'u' hex hex hex hex

hex
    digit
    'A' . 'F'
    'a' . 'f'

number
    integer fraction exponent

integer
    digit
    onenine digits
    '-' digit
    '-' onenine digits

digits
    digit
    digit digits

digit
    '0'
    onenine

onenine
    '1' . '9'

fraction
    ""
    '.' digits

exponent
    ""
    'E' sign digits
    'e' sign digits

sign
    ""
    '+'
    '-'

ws
    ""
    '0020' ws
    '000A' ws
    '000D' ws
    '0009' ws
```

## 何の役に立つの？

PythJSONは、一見するとつまらないデータ交換フォーマットである。が、このフォーマットは意外な利便性を提供してくれる可能性は否定できない。

まず、このフォーマットで書かれたデータはPythonコードとしても、JSONデータとしても、JavaScriptコードとしても正当である。JavaScriptで作ったデータを、Jupyter Notebookで処理する、といったシナリオでは、このフォーマットを用いることでデータのやり取りが楽になるだろう。

また、PythJSONに従っているデータであれば、データを

```py
import json

data = json.loads(r"""
{
  "key": "value"
}    
""")
```

のようにJSON文字列でPythonコード上にハードコードする代わりに、

```py
data = {
  "key": "value"
}
```

としてそのままオブジェクトをソースコードに書くことができる。前者のようにJSONを文字列として埋め込む場合、文法エラーは実行時にしかわからないが、後者のように書けば静的解析の恩恵を受けることができる。