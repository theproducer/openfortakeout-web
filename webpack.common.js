const webpack = require("webpack");
const path = require("path");
const htmlwebpackplugin = require("html-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    website: ["./src/js/site.js", "./src/scss/web.scss"],
    listing: ["./src/react/listing.jsx"],
    form: ["./src/react/form.jsx", "./src/react/updateform.jsx"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./js/[name].[contenthash].js",
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
      {
        test: /\.s[c|a]ss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "resolve-url-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg|otf)$/,
        loaders: ["file-loader?limit=1024&name=/[folder]/[name].[ext]"],
      },
      {
        test: /\.(woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./fonts",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFileName: "[id].[contenthash].css",
    }),
    new CopyPlugin([{ from: "./src/img", to: "./img" }]),
    new htmlwebpackplugin({
      title: "Open for Takeout - Home",
      filename: "index.html",
      template: "src/index.html",
    }),
    new htmlwebpackplugin({
      title: "Open for Takeout - Add Business",
      filename: "submit-business.html",
      template: "src/submit-business.html",
    }),
    new htmlwebpackplugin({
      title: "Open for Takeout - Update Business",
      filename: "corrections.html",
      template: "src/corrections.html",
    }),
    new htmlwebpackplugin({
      title: "Open for Takeout - About",
      filename: "about.html",
      template: "src/about.html",
    }),
  ],
};
