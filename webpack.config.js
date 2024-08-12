const webpack = require('webpack'); // 添加 webpack 引入
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const historyApiFallback = require('connect-history-api-fallback');

module.exports = {
    mode: 'development',
    entry: './client/src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
        publicPath: '/' 
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource' 
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/src/index.html'
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /express\/lib\/view\.js/,
            contextRegExp: /node_modules/
        })
    ], // 添加缺失的逗号
    devServer: {
        host: 'localhost',
        port: 8080,
        hot: true,
        historyApiFallback: true,
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:3000',
                secure: false,
                changeOrigin: true,
                pathRewrite: {'^/api': ''}
            }
        ]
    },
    resolve: {
        fallback: {
            "assert": require.resolve("assert/"),
            "crypto": require.resolve("crypto-browserify"),
            "querystring": require.resolve("querystring-es3"),
            "stream": require.resolve("stream-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "fs": false,
            "net": false,
            "vm": require.resolve("vm-browserify"),
            "async_hooks": false
        },
        extensions: ['.js', '.jsx'],
    }
};
