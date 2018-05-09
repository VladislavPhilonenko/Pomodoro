/**
 * Created by Vladyslav_Filonenko on 1/11/2018.
 */
const path = require('path');

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    files: [
      'test/index.js'
    ],
    // coverage reporter generates the coverage
    reporters: ['progress', 'coverage-istanbul'],

    preprocessors: {
      'test/index.js': 'webpack'
    },
    webpack: {
      module: {
        rules: [
          // skip assest
          { test: /\.less$/, loader: 'ignore-loader' },
          { test: /\.css$/, loader: 'ignore-loader' },
          { test: /\.hbs$/, loader: 'ignore-loader' },
          // instrument only testing sources with Istanbul
          {
            test: /\.js$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true }
            },
            enforce: 'post',
            exclude: /node_modules|view|header|test|\.spec\.js$|^app.js$/
          }]
      },
      devtool: 'inline-source-map'
    },
    // optionally, configure the reporter
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: path.join(__dirname, 'coverage'),
      fixWebpackSourcePaths: true,
      html: {
        // outputs the report in ./coverage/html
        subdir: 'html'
      }
    }
  });
};
