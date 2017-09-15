const webpackConfig = require("./webpack.config");
const externalAssets = require("./lib/javascripts/external_assets");

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],

    // list of files / patterns to load in the browser
    files: externalAssets.js.concat([
      "spec/helpers/**/*.js",
      "spec/**/*_spec.js",
      "node_modules/babel-polyfill/dist/polyfill.js"
    ]),

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "spec/helpers/**/*.js": ["webpack"],
      "spec/**/*_spec.js": ["webpack"]
    },

    webpack: {
      // karma watches the test entry points
      // (you don't need to specify the entry option)
      // webpack watches dependencies

      // webpack configuration
      module: webpackConfig.module,
      resolveLoader: webpackConfig.resolveLoader,
      resolve: webpackConfig.resolve,
      externals: webpackConfig.externals
    },

    webpackServer: {
      noInfo: true // Suppress all webpack messages, except errors
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: "errors-only"
    },

    plugins: [
      require("karma-webpack"),
      require("karma-jasmine"),
      require("karma-phantomjs-launcher"),
      require("karma-chrome-launcher")
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["dots"],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["PhantomJS"],

    customLaunchers: {
      // CRUFT: needed to load zaf_sdk with crossorigin=anonymous
      Chrome_without_security: {
        base: "Chrome",
        flags: ["--disable-web-security"]
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
