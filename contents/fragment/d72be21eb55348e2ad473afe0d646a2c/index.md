# ExcelでBOMなしUTF-8のCSVファイルを開くと文字化けする

- 環境
  - macOS 15.1.1
  - Microsoft® Excel for Mac 16.103.2 (25112216)
- Microsoft Excelで、UTF-8 (BOMなし)で保存されたCSVファイルを開くと文字化けする
- ![](./Screenshot%202025-11-28%20at%2014.36.36.png)
- ![](./Screenshot%202025-11-28%20at%2014.48.02.png)
- 文字化けを防ぐには、ファイルをUTF-8 (BOMあり)で保存する必要がある
- BOMの有無は、`file`コマンドで調べることができる:
  ```
  % file Untitled.csv
  Untitled.csv: Unicode text, UTF-8 text, with no line terminators
  % file Untitled_bom.csv
  Untitled_bom.csv: Unicode text, UTF-8 (with BOM) text, with no line terminators
  ```
- BOMの追記はテキストエディタでやるのが安全だが、コマンドラインでやる場合は例えば:
  ```
  % printf '\xEF\xBB\xBF' | cat - Untitled.csv  > with_bom.csv
  ```