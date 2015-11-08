ShioriJK - SHIORI/3.x Parser/Container
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

**Do you know that SHIORI is not JS but JK ?**

Installation
--------------------------

    npm install shiorijk

    bower install shiorijk

What is ShioriJK ?
--------------------------

ShioriJK is a library of SHIORI protocol parsers and containers implemented by Javascript (CoffeeScript) for making SHIORI subsystem.

### Usage

See the SHIORI implementation [MiyoJS](https://github.com/Narazaka/miyojs.git) that is using ShioriJK.

Overview
--------------------------

Pass SHIORI request transaction or its chunk to ShioriJK then it parses the request and returns parsed request data in the container.

Document
--------------------------

See [http://narazaka.github.io/shiorijk/](http://narazaka.github.io/shiorijk/) or the source in src/.

Also you can found the code snippets in test/.

Build
--------------------------

    git submodule init
    git submodule update
    npm install
    gulp

License
--------------------------

This is released under [MIT License](http://narazaka.net/license/MIT?2014).
