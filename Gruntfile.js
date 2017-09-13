var babel = require('rollup-plugin-babel');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var replace = require('rollup-plugin-replace');

var swPrecacheConf = require('./sw-precache.conf.js');
var builtins = require('rollup-plugin-node-builtins');
var globals = require('rollup-plugin-node-globals');

module.exports = function(grunt) {

    var target = grunt.option('target');
    var importPath;
    if (target == "dev") {
        importPath = ["../grunt/pathConfig/dev"];
    } else if (target == "test") {
        importPath = ["../grunt/pathConfig/test"];
    } else if (target == "stag") {
        importPath = ["../grunt/pathConfig/stag"];
    }
    
    
    grunt.initConfig({
        env: {
            dev: {},
            test: {},
            test1: {},
            test2: {},
            test3: {},
            test4: {},
            stag: {},
            docker: {}
        },
        create: {
            options: {
                fileExts: ['.js', '.css', '.woff', '.woff2', 'ttf', '.eot']
            },
            src: [
                'src/j',
                'src/c'
            ]
        },
        av: {
            options: {
                blackListedFiles: ['Gruntfile.js', 'fileTable.json']
            },
            src: [
                'src/j',
                'src/c'
            ]
        },
        merge: {
            src: [
                'src/j',
                'src/c'
            ]
        },
        compass: {
            dev: {
                options: {
                    importPath: importPath
                }
            }
        },
        concat: {
            plugins_js: {
                src: ['!**/*'],
                dest: 'gen/no.use',
                nonull: true
            }
        },
        rollup: {
            interfaces: {
                options: {
                    moduleName: "interfaces",
                    format: "iife",
                    plugins: function() {
                        return [
                            nodeResolve({ jsnext: true, main: true }),
                            commonjs({
                                namedExports: {
                                    '../node_modules/react/react.js': ['Children', 'Component', 'PureComponent', 'PropTypes', 'createElement']
                                }
                            }),
                            replace({
                                'process.env.NODE_ENV': JSON.stringify((target != "dev") ? "production" : target)
                            }),
                            babel({
                                exclude: '../node_modules/**'
                            })
                        ];
                    }
                },
                files: [{
                    'dest': 'src/j/external.js',
                    'src': 'src/app/vendor/external/index.js'
                }, {
                    'dest': 'src/j/internal.js',
                    'src': 'src/app/vendor/internal/index.js'
                }]
            },
            appjs: {
                options: {
                    moduleName: "common",
                    format: "iife",
                    plugins: function() {
                        return [

                            babel({
                                exclude: '../node_modules/**'
                            }),
                            //nodeResolve({ jsnext: true, main: true, skip: ['react'] }),
                            commonjs(),
                            replace({
                                'process.env.NODE_ENV': JSON.stringify(target)
                            })
                        ];
                    },
                    globals: {
                        react: 'interfaces["Virtual"]',
                        reactDom: 'interfaces["VirtualDom"]'
                    }
                },
                files: [{
                    'dest': 'src/j/app.js',
                    'src': 'src/app/index.js'
                }]
            },
            tracking: {
                options: {
                    format: "amd",
                    plugins: function() {
                        return [
                            babel({
                                exclude: '../node_modules/**'
                            }),
                            //nodeResolve({ jsnext: true, main: true, skip: ['react'] }),
                            commonjs(),
                            replace({
                                'process.env.NODE_ENV': JSON.stringify(target)
                            })
                        ];
                    },
                    globals: {
                        react: 'interfaces["Virtual"]',
                        reactDom: 'interfaces["VirtualDom"]'
                    }
                },
                files: [{
                    'dest': 'src/j/tracking.js',
                    'src': '../100/src/app/tracking/index.js'
                }]
            },
            // Define your flow here... e.g.,           
            flowName: {
                options: {
                    //moduleId: 'flowName',
                    format: "amd",
                    plugins: function() {
                        return [
                            babel({
                                exclude: '../node_modules/**'
                            }),
                            //nodeResolve({ jsnext: true, main: true, skip: ['react'] }),
                            commonjs(),
                            replace({
                                'process.env.NODE_ENV': JSON.stringify(target)
                            })
                        ];
                    },
                    globals: {
                        react: 'interfaces["Virtual"]',
                        reactDom: 'interfaces["VirtualDom"]'
                    }
                },
                files: [{
                    'dest': 'src/j/flowName.js',
                    'src': 'src/app/flowName/index.js'
                }]
            },
            testResources: {
                options: {
                    format: "amd",
                    plugins: function() {
                        return [
                            babel({
                                exclude: './node_modules/**'
                            }),
                            replace({
                                'process.env.NODE_ENV': JSON.stringify(target)
                            })
                        ];
                    }
                },
                files: [{
                    'src': "src/test/routeUtil/LazyView1.js",
                    'dest': "src/j/test/routeUtil/LazyView1.js"
                }, {
                    'src': "src/test/routeUtil/LazyView2.js",
                    'dest': "src/j/test/routeUtil/LazyView2.js"
                }]
            },

        },
        watch: {
            appjs: {
                files: ['src/app/*.js', 'src/app/root/**/*.js'],
                tasks: ["rollup:appjs"]
            },
            // Add watch config of your flow here
            flowName: {
                files: ['src/app/*.js', 'src/app/flowName/**/*.js'],
                tasks: ["rollup:flowName"]
            }
        }
    });


    grunt.file.expand('../node_modules/grunt-*/tasks').forEach(grunt.loadTasks);
    grunt.loadNpmTasks('grunt-karma');

    require('grunt-config-merge')(grunt);
    require('../grunt/global/grunt-lifecycle.js')(grunt);

    swPrecacheConf(grunt, target);
    grunt.registerTask('interfaces', ["rollup:interfaces"]);
    // register your flow here...
    grunt.registerTask('default', ["rollup:appjs", "rollup:flowName", "rollup:testResources", "tocss"]);
};