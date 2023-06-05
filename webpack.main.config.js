const path = require('path');
const { DefinePlugin } = require('webpack');

module.exports = {
  entry: './src/main.js',
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './src/main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js','.ts','.tsx'],
  },
  plugins: [
    new DefinePlugin({
      __static: `"${path.join(__dirname, "static").replace(/\\/g, "\\\\")}"`,
    }),
  ],
};