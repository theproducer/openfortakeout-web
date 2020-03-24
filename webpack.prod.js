const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    stats: {
        colors: false,
        hash: true,
        timings: true,
        assets: true,
        chunks: true,
        chunkModules: true,
        modules: true,
        children: true,
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 6,
                }
            })
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {                
                'API_URL': '"' + process.env.API_URL + '"'
            }
        })
    ]
});