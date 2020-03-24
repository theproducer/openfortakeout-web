const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    watch: true,
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9090,
        publicPath: "/",
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'API_URL': '"http://localhost:9292"'
            }
        })
    ]
});