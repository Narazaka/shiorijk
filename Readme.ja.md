ShioriJK - SHIORI/3.x パーサ/コンテナ
=============================================

[![npm](https://img.shields.io/npm/v/shiorijk.svg)](https://www.npmjs.com/package/shiorijk)
[![npm license](https://img.shields.io/npm/l/shiorijk.svg)](https://www.npmjs.com/package/shiorijk)
[![npm download total](https://img.shields.io/npm/dt/shiorijk.svg)](https://www.npmjs.com/package/shiorijk)
[![npm download by month](https://img.shields.io/npm/dm/shiorijk.svg)](https://www.npmjs.com/package/shiorijk)
[![Bower](https://img.shields.io/bower/v/shiorijk.svg)](https://github.com/Narazaka/shiorijk)
[![Bower](https://img.shields.io/bower/l/shiorijk.svg)](https://github.com/Narazaka/shiorijk)

[![Dependency Status](https://david-dm.org/Narazaka/shiorijk.svg)](https://david-dm.org/Narazaka/shiorijk)
[![devDependency Status](https://david-dm.org/Narazaka/shiorijk/dev-status.svg)](https://david-dm.org/Narazaka/shiorijk#info=devDependencies)
[![Build Status](https://travis-ci.org/Narazaka/shiorijk.svg)](https://travis-ci.org/Narazaka/shiorijk)
[![codecov.io](https://codecov.io/github/Narazaka/shiorijk/coverage.svg?branch=master)](https://codecov.io/github/Narazaka/shiorijk?branch=master)
[![Code Climate](https://codeclimate.com/github/Narazaka/shiorijk/badges/gpa.svg)](https://codeclimate.com/github/Narazaka/shiorijk)

**つまるところ、栞はJKである**

インストール
--------------------------

    npm install shiorijk

    bower install shiorijk

ShioriJKとは何か?
--------------------------

伺かのSHIORIサブシステム構築のためのSHIORIプロトコルパーサとコンテナのJavaScript(CoffeeScript)による実装です。

JavaScriptで栞を組みたくなった場合にお使いください。

### ShioriJKとは何でないか?

ShioriJKはSHIORIプロトコルパーサとコンテナのみを実装しているライブラリであり、これ単体で栞とすることは出来ません。

### なにそれおいしいの?

この説明でピンと来ない人には縁遠いものです。

このライブラリを使用した栞の実装である[MiyoJS](https://github.com/Narazaka/miyojs)や、ベースウェアの実装である[イカガカ](https://github.com/Ikagaka/Ikagaka.demo)をまずはご参照ください。

どんなかんじか
--------------------------

SHIORIリクエストあるいはその断片を渡すとてきとうに解釈してコンテナに入れて返します。

現在のところSHIORI/3.0のみを扱えます。

ドキュメント
--------------------------

[http://narazaka.github.io/shiorijk/](http://narazaka.github.io/shiorijk/)か、src/にあるコメント付きのソースをご覧ください。

ドキュメントがルーズだと感じたら、ライブラリやテストコードの中身を読んでいただいたほうがわかりやすいかもしれません。

ビルド
--------------------------

    git submodule init
    git submodule update
    npm install
    gulp

ライセンス
--------------------------

[MITライセンス](http://narazaka.net/license/MIT?2014)の元で配布いたします。
