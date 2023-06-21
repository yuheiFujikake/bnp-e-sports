const path = require("path");
const PugPlugin = require("pug-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// aliases used in sources of pug, scss, js
const Resolve = {
  alias: {
    "~": path.join(__dirname, "./src/"),
    Images: path.join(__dirname, "./src/resource/"),
  },
};

const RulesPug = {
  test: /\.pug$/,
  loader: PugPlugin.loader,
};

const RulesJavaScript = {
  test: /\.js$/,
  use: [
    {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  ],
};

const RulesStyle = {
  test: /\.(css|sass|scss)$/,
  use: [
    "css-loader",
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
    "sass-loader",
  ],
};

const RulesImages = {
  test: /\.(PNG|png|svg|jpe?g|webp)$/i,
  type: "asset/resource",
  // include: /assets[\\/]images/,
  generator: {
    filename: "./assets/img/[name].[hash:8][ext]",
  },
};

module.exports = {
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, "docs"),
    },
    compress: true,
    watchFiles: {
      paths: ["src/**/*.*"],
      options: {
        usePolling: true,
      },
    },
    open: true,
  },
  devtool: "source-map",
  entry: {
    index: "./src/root/index.pug",
  },
  output: {
    path: path.resolve(__dirname, "docs"),
    publicPath: "/",
  },
  module: {
    rules: [RulesPug, RulesJavaScript, RulesStyle, RulesImages],
  },
  resolve: Resolve,
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new PugPlugin({
      js: { filename: "./assets/js/[name].[contenthash:8].js" },
      css: { filename: "./assets/css/[name].[contenthash:8].css" },
    }),
  ],
};
