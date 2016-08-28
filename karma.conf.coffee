module.exports = (config) ->
  config.set
    basePath: ''
    frameworks: [ 'detectBrowsers', 'mocha' ]
    files: [
      'node_modules/chai/chai.js'
      'src/lib/shiorijk.coffee'
      'src/lib/shiorijk-container.coffee'
      'src/lib/shiorijk-shiori-parser.coffee'
      'test/**/*.coffee'
    ]
    exclude: [ '**/*.swp' ]
    preprocessors:
      'src/**/*.coffee': [ 'coffee', 'coverage' ]
      'test/**/*.coffee': [ 'coffee', 'espower' ]
    espowerPreprocessor:
      transformPath: (path) ->
        path.replace /\.coffee$/, '.espower'
    coffeePreprocessor:
      options:
        bare: true
        sourceMap: true
      transformPath: (path) ->
        path.replace /\.coffee$/, '.js'
    coverageReporter:
      reporters: [{type: 'lcov'}]
    reporters: [ 'mocha-own', 'coverage' ]
    detectBrowsers:
      postDetection: (availableBrowsers) ->
        result = availableBrowsers
        if process.env.TRAVIS
          chrome_index = availableBrowsers.indexOf('Chrome')
          if chrome_index >= 0
            result.splice(chrome_index, 1)
            result.push('Chrome_travis_ci')
        result
    customLaunchers:
      Chrome_travis_ci:
         base: 'Chrome'
         flags: ['--no-sandbox']
    port: 9876
    colors: true
    logLevel: config.LOG_INFO
    autoWatch: true
    browsers: [ ]
    singleRun: false
    concurrency: Infinity
