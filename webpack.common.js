const webpack = require("webpack");
const path = require("path");
const htmlwebpackplugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const postcssPresetEnv = require("postcss-preset-env");
const postcssImport = require("postcss-import");
const cssnano = require("cssnano");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const minicssExtract = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    website: ["./src/js/site.js", "./src/scss/web.scss"],
    listing: ["./src/react/listing.jsx"],
    form: ["./src/react/form.jsx", "./src/react/updateform.jsx"],
    admin: ["./src/react/admin.jsx"],
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
          minicssExtract.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => [
                postcssImport(),
                postcssPresetEnv(),
                autoprefixer(),
                cssnano({
                  preset: "default",
                }),
              ],
            },
          },
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
    new minicssExtract({
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
    new htmlwebpackplugin({
      title: "Open for Takeout - Admin",
      filename: "admin.html",
      template: "src/admin.html",
    }),
  ],
};
