const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const cssInline = false;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const WebpackWatchedGlobEntries = require("webpack-watched-glob-entries-plugin");
const { htmlWebpackPluginTemplateCustomizer } = require("template-ejs-loader");
const entries = WebpackWatchedGlobEntries.getEntries(
  [path.resolve(__dirname, "./src/*.ejs")],
  {
    ignore: path.resolve(__dirname, "./src/_*.ejs"),
  }
)();

if (cssInline) {
  styleLoader = "style-loader";
} else {
  styleLoader = { loader: MiniCssExtractPlugin.loader };
}

// 複数htmlを出力させる
const htmlGlobPlugins = (entries, srcPath) => {
  return Object.keys(entries).map(
    (key) =>
      new HtmlWebpackPlugin({
        //出力ファイル名
        filename: `${key}.html`,
        //テンプレートに使用するファイルを指定 htmlの場合は.html ejsの場合は.ejs
        template: htmlWebpackPluginTemplateCustomizer({
          templatePath: `${srcPath}/${key}.ejs`,
        }),
        // <script> ~ </script> タグの挿入位置
        inject: "body",
        // スクリプト読み込みのタイプ
        scriptLoading: "defer",
      })
  );
};

module.exports = {
  mode: "development",

  devServer: {
    static: path.resolve(__dirname, "src"),
    port: 8080,
    open: true,
  },
  devtool: "source-map",
  entry: "./src/assets/js/index.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "assets/js/index.js",
    assetModuleFilename: "assets/images/[name][ext]",
  },
  module: {
    rules: [
      // ejsの設定
      {
        test: /\.ejs$/i,
        use: ["template-ejs-loader"],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      // scssの設定
      {
        test: /\.(sass|scss)$/,
        use: [
          styleLoader,
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  ["autoprefixer", { grid: true }],
                  ["cssnano", { preset: "default" }],
                ],
              },
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      // imagesの設定
      {
        test: /\.(png|jpg|gif)$/i,
        generator: {
          filename: "images/[name][ext][query]",
        },
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "assets/css/style.css" }),
    ...htmlGlobPlugins(entries, "./src"),
    new CopyPlugin({
      patterns: [
        {
          from: `${path.resolve(__dirname, "src")}/assets/images/`,
          to: `${path.resolve(__dirname, "dist")}/assets/images/`,
        },
      ],
    }),
  ],
};
