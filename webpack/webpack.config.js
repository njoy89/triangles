var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var sassLoaders = [
    "css-loader",
    "sass-loader",
    "postcss-loader"
];

console.log(__dirname);
module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:3001',
        'webpack/hot/dev-server',
        './client/main'
    ],
    output: {
        path: path.join(__dirname, '../client/dist'),
        filename: 'bundle.js',
        publicPath: 'http://localhost:3001/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name].css', { allChunks: true })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot', 'babel'],
                include: path.join(__dirname, '../client')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)|\.(png|jpg|jpeg|gif|woff)/,
                loader: 'url-loader'
            }
        ]
    },
    watch: true
};