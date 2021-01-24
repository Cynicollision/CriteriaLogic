module.exports = function (config) {
    config.set({
        basePath: '',
        files: [
            'src/**/*.ts'
        ],
        frameworks: [
            'jasmine', 
            'karma-typescript'
        ],
        exclude: [
            'node_modules'
        ],
        preprocessors: {
            "**/*.ts": "karma-typescript"
        },
        reporters: [
            'progress', 
            'karma-typescript'
        ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [
            'ChromeHeadless'
        ],
        singleRun: false,
        concurrency: Infinity,
        webpack: {
            mode: 'development'
        }
    });
};