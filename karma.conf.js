// Karma configuration
// Generated on Fri Feb 19 2016 12:09:53 GMT+0530 (India Standard Time)

const path = require('path');
const webpack = require('webpack');

module.exports = function(config) {
    
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine-ajax', 'jasmine'],


        // list of files / patterns to load in the browser
        files: [
            './node_modules/whatwg-fetch/fetch.js',
            'src/j/external.js',
            'src/j/internal.js',
            'src/j/require.js',
            { pattern: 'test-context.js' }
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test-context.js': ['webpack']
        },

        webpack: {
            
            devtool: 'inline-source-map', // just do inline source maps instead of the default  
            node: {
                fs: 'empty'
            },
            externals: {
                cheerio: 'window',
                'react/addons': true,
                'react/lib/ExecutionEnvironment': true,
                'react/lib/ReactContext': true,
                'react-addons-test-utils': 'react-test-renderer',
                'interfaces':'interfaces'
                /*'Virtual': {
                    root: ['interfaces', 'Virtual']
                }*/
            },
            module: {
                rules: [{
                    test: /\.js$/,
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: ['env'],
                        plugins: ['babel-plugin-transform-object-rest-spread','babel-plugin-transform-class-properties', ["babel-plugin-transform-react-jsx",
                            {
                                "pragma": "Virtual.createElement" // default pragma is React.createElement
                            },

                        ]]
                    },
                    exclude:[path.resolve('node_modules')]
                }, {
                    test: /\.js$/,
                    enforce: 'post',
                    use: {
                        loader: 'istanbul-instrumenter-loader',
                        options: { esModules: true }
                    },
                    exclude:[path.resolve('node_modules')]
                }]
            },
            watch: true,
            plugins: [
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: JSON.stringify('dev')
                    }
                })
            ]
        },

        reporters: [ /*'dots',*/ 'coverage-istanbul' /*, 'junit'*/ ],
        coverageIstanbulReporter: {
            reports: ['html', 'text-summary'],
            dir: path.join(__dirname + '/src', 'coverage'),
            fixWebpackSourcePaths: true
        },
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
        browsers: ['PhantomJS'], //PhantomJS


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}