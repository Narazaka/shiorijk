path = require 'path'
gulp = require 'gulp'
merge = require 'merge-stream'
$ = (require 'gulp-load-plugins')()
Server = require('karma').Server
package_json = require './package.json'

file = 'shiorijk.js'

files =
  src:
    coffee: [
      'src/lib/shiorijk.coffee'
      'src/lib/shiorijk-container.coffee'
      'src/lib/shiorijk-shiori-parser.coffee'
    ]
  dst:
    js: 'lib/shiorijk.js'
  test:
    coffee: 'test/**/*.coffee'

dirs =
  src: 'src'
  dst: 'lib'

gulp.task 'default', ['build']

gulp.task 'js', ->
  coffee = gulp.src files.src.coffee
    .pipe $.sourcemaps.init()
    .pipe $.concat file
    .pipe $.coffee bare: true
  coffeeu = coffee.pipe $.clone()
  merge [
    coffee
      .pipe $.sourcemaps.write('.')
      .pipe gulp.dest dirs.dst
    coffeeu
      .pipe $.uglify()
      .pipe $.rename extname: '.min.js'
      .pipe $.sourcemaps.write('.')
      .pipe gulp.dest dirs.dst
  ]

gulp.task 'build', ['js', 'test', 'doc']

gulp.task 'test', ['test-cli', 'test-browser']

gulp.task 'pre-test', ->
  gulp.src files.dst.js
    .pipe $.istanbul()
    .pipe $.istanbul.hookRequire()

gulp.task 'test-cli', ['pre-test'], ->
  gulp.src files.test.coffee
    .pipe $.mocha()
    .pipe $.istanbul.writeReports()

gulp.task 'test-browser', (done) ->
  new Server
    configFile: "#{__dirname}/karma.conf.coffee"
    singleRun: true
  , done
    .start()

gulp.task 'test-browser-cli', (done) ->
  new Server
    configFile: "#{__dirname}/karma.conf.coffee"
    singleRun: true
    frameworks: [ 'mocha-debug', 'mocha' ]
    browsers: ['PhantomJS']
  , done
    .start()

gulp.task 'test-browser-watch', (done) ->
  new Server
    configFile: "#{__dirname}/karma.conf.coffee"
  , done
    .start()

gulp.task 'doc', ->
  gulp.src files.src.coffee, read: false
    .pipe $.codo
      name: "ShioriJK"
      title: "ShioriJK Documentation"

gulp.task 'watch', ->
  gulp.start ['js', 'test-cli', 'test-browser-watch', 'doc']
  $.watch files.src.coffee.concat([files.test.coffee]), -> gulp.start ['js', 'test-cli', 'doc']
