const webpack = require('webpack');
const path = require('path');
const htmlwebpackplugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        website: ['./src/js/site.js', './src/scss/web.scss'],
        listing: ['./src/react/listing.jsx'],
        form: ['./src/react/form.jsx']
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: './[name].[hash].js'
    },
    resolve: {
        extensions: ['.jsx', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude : /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        "presets": ["@babel/preset-env", "@babel/preset-react"],
                        "plugins": ["@babel/plugin-proposal-class-properties"]
                    }
                }
            }, {
                test: /\.(css|scss)$/,
                use: [
                    "style-loader",
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './',
                            hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require('sass')
                        }
                    },
                    "postcss-loader",
                    "resolve-url-loader"
                ]
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg|otf)$/,
                loaders: ['file-loader?limit=1024&name=./img/[name].[ext]']
            },{
                test: /\.(woff|woff2)$/,
                loaders: ['file-loader?limit=1024&name=./fonts/[name].[ext]']
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './website.css',
            chunkFileName: '[id].[hash].css'
        }),
        new htmlwebpackplugin({
            title: 'Open for Takeout - Home',
            filename: "index.html",
            template: 'src/index.html'
        }),
        new htmlwebpackplugin({
            title: 'Open for Takeout - Add Business',
            filename: "submit-business.html",
            template: 'src/submit-business.html'
        }),
        new htmlwebpackplugin({
            title: 'Open for Takeout - About',
            filename: "about.html",
            template: 'src/about.html'
        }),
    ]
};