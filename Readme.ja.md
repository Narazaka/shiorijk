ShioriJK - SHIORI/3.x パーサ/コンテナ
=============================================

[![npm](https://img.shields.io/npm/v/shiorijk.svg)](https://www.npmjs.com/package/shiorijk)
[![npm license](https://img.shields.io/npm/l/shiorijk.svg)](https://www.npmjs.com/package/shiorijk)
[![npm download total](https://img.shields.io/npm/dt/shiorijk.svg)](https://www.npmjs.com/package/shiorijk)
[![npm download by month](https://img.shields.io/npm/dm/shiorijk.svg)](https://www.npmjs.com/package/shiorijk)
[![Bower](https://img.shields.io/bower/v/shiorijk.svg)](https://github.com/Narazaka/shiorijk)
[![Bower](https://img.shields.io/bower/l/shiorijk.svg)](https://github.com/Narazaka/shiorijk)

[![Dependency Status](https://david-dm.org/Narazaka/shiorijk/status.svg)](https://david-dm.org/Narazaka/shiorijk)
[![devDependency Status](https://david-dm.org/Narazaka/shiorijk/dev-status.svg)](https://david-dm.org/Narazaka/shiorijk?type=dev)
[![Travis Build Status](https://travis-ci.org/Narazaka/shiorijk.svg?branch=master)](https://travis-ci.org/Narazaka/shiorijk)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/Narazaka/shiorijk?svg=true&branch=master)](https://ci.appveyor.com/project/Narazaka/shiorijk)
[![codecov.io](https://codecov.io/github/Narazaka/shiorijk/coverage.svg?branch=master)](https://codecov.io/github/Narazaka/shiorijk?branch=master)
[![Code Climate](https://codeclimate.com/github/Narazaka/shiorijk/badges/gpa.svg)](https://codeclimate.com/github/Narazaka/shiorijk)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3e8aa6e24b6d47c29aa8ebb82b6a1e06)](https://www.codacy.com/app/narazaka/shiorijk?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Narazaka/shiorijk&amp;utm_campaign=Badge_Grade)
[![Greenkeeper badge](https://badges.greenkeeper.io/Narazaka/single-file-worker.js.svg)](https://greenkeeper.io/)

**つまるところ、栞はJKである**

インストール
--------------------------

    npm install shiorijk

or

    bower install shiorijk

ShioriJKとは何か?
--------------------------

伺かのSHIORIサブシステム構築のためのSHIORIプロトコルパーサとコンテナのJavaScript(TypeScript)による実装です。

JavaScriptで栞を組みたくなった場合にお使いください。

ShioriJKとは何でないか?
--------------------------

ShioriJKはSHIORIプロトコルパーサとコンテナのみを実装しているライブラリであり、これ単体で栞とすることは出来ません。

利用方法概要
--------------------------

SHIORIリクエスト/レスポンスあるいはその断片を渡すとてきとうに解釈してコンテナに入れて返します。
またコンテナからリクエスト/レスポンス文字列を生成することも出来ます。

現在のところSHIORI/3.xのみを扱えます。（SHIORI/2.xにも対応していますが、同一ヘッダが複数存在する一部リクエストを正しくパースできません。）

[example/example.ts](example/example.ts)
```typescript
import * as ShioriJK from "shiorijk";
// const ShioriJK = require("shiorijk"); // also OK

// ---------- リクエストのパース ----------

// 1つのトランザクションをパース
const requestParser = new ShioriJK.Shiori.Request.Parser();
const requestStr =
  "GET SHIORI/3.0\r\n" +
  "Charset: UTF-8\r\n" +
  "Sender: embryo\r\n" +
  "ID: OnBIFFComplete\r\n" +
  "Reference0: 2\r\n" +
  "Reference1: 1024\r\n" +
  "Reference2: mail.example.com\r\n" +
  "Reference3: 1\r\n" +
  "Reference4: Subject: foo\x01X-Mailer: sendmail\x02Subject: bar\x01X-Mailer: Sylpheed\r\n" +
  "Reference5: 512\x01512\r\n" +
  "Reference6: 123@example.com\x01456@example.com\r\n" +
  "\r\n";
const request = requestParser.parse(requestStr);
console.log(request.request_line.method === "GET"); // リクエスト行の情報
console.log(request.headers.get("ID") === "OnBIFFComplete"); // ヘッダ値を取得
console.log(request.headers.ID === "OnBIFFComplete"); // よく使うヘッダへのショートカット
console.log(request.headers.Reference(1) === "1024"); // Reference*へのショートカット
console.log(request.headers.references().length === 7); // 全てのReference*の値を取得
console.log((request.headers.get_separated("Reference6") || [])[0] === "123@example.com"); // \x01で区切られた値の取得
console.log((request.headers.get_separated2("Reference4") || [])[1][0] === "Subject: bar"); // \x01と\x02で区切られた値の取得

// チャンクを元にパース(HTTPのように)
let parseResult;
parseResult = requestParser.parse_chunk("GET SHIORI/3.0\r\nCharset: UTF-8\r\n");
console.log(parseResult.state === "continue");
parseResult = requestParser.parse_chunk("ID: version\r\n\r\n");
console.log(parseResult.state === "end");
console.log(parseResult.results.length === 1);
console.log(parseResult.results[0].headers.ID === "version");

// 行ごとにパース
parseResult = requestParser.parse_lines(["GET SHIORI/3.0", "Charset: UTF-8"]);
console.log(parseResult.state === "continue");
parseResult = requestParser.parse_lines(["ID: version", ""]);
console.log(parseResult.state === "end");
console.log(parseResult.results[0].headers.ID === "version");

// ---------- レスポンスのパース ----------

const responseParser = new ShioriJK.Shiori.Response.Parser();
const responseStr =
  "SHIORI/3.0 200 OK\r\n" +
  "Sender: ikaga\r\n" +
  "Charset: UTF-8\r\n" +
  "Value: 8.2.8\r\n" +
  "\r\n";
const response = responseParser.parse(responseStr);
console.log(response.headers.Value === "8.2.8");

// チャンクや行を元にしたパースも対応

// ---------- リクエストのビルド ----------

const request2 = new ShioriJK.Message.Request({
  request_line: {method: "GET", version: "3.0"},
  headers: {
    Charset: "UTF-8",
    Sender: "embryo",
  },
});

// 初期化後にも値をセット
request2.headers.set("ID", "version");

console.log(request2.toString() === "GET SHIORI/3.0\r\nCharset: UTF-8\r\nSender: embryo\r\nID: version\r\n\r\n");

// ---------- レスポンスのビルド ----------

const response2 = new ShioriJK.Message.Response({
  status_line: {code: 200, version: "3.0"},
  headers: {
    Charset: "UTF-8",
    Sender: "ikaga",
    Value: "8.2.8",
  }
});

console.log(response2.toString() === "SHIORI/3.0 200 OK\r\nCharset: UTF-8\r\nSender: ikaga\r\nValue: 8.2.8\r\n\r\n");
```

さらに見る: このライブラリを使用した栞の実装である[SanaJK](https://github.com/Narazaka/sanajk)や、ベースウェアの実装である[イカガカ](https://github.com/Ikagaka/Ikagaka.demo)をご参照ください。

APIドキュメント
--------------------------

[http://narazaka.github.io/shiorijk/](http://narazaka.github.io/shiorijk/)か、[lib/](lib)にあるコメント付きのソースをご覧ください。

ドキュメントがルーズだと感じたら、ライブラリや[テストコード](test)の中身を読んでいただいたほうがわかりやすいかもしれません。

履歴
--------------------------

### v1.0.0

- CoffeeScript -> TypeScript
- 基本的なJavaScript APIに変化はありません。
- null結合型は次のように変更されました : `Foo | null | undefined` -> `Foo | undefined`
- いくつかのAPIに存在した文字列throwはErrorを継承したクラスをthrowするように変更されました。
- ES5以上を要求します（つまりIE8以下で動作させるにはshimが必要です）。

ライセンス
--------------------------

[MITライセンス](http://narazaka.net/license/MIT?2018)の元で配布いたします。
