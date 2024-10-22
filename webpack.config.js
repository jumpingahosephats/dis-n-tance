 const path = require('path');
   const HtmlWebpackPlugin = require('html-webpack-plugin');

   module.exports = {
       mode: 'development',
       entry: './src/index.tsx',
       output: {
           path: path.resolve(__dirname, 'dist'),
           filename: 'bundle.js',
       },
       resolve: {
           extensions: ['.tsx', '.ts', '.js'],
       },
       module: {
           rules: [
               {
                   test: /\.tsx?$/,
                   use: 'ts-loader',
                   exclude: /node_modules/,
               },
           ],
       },
       plugins: [
           new HtmlWebpackPlugin({
               template: './index.html',
           }),
       ],
       devServer: {
           static: path.join(__dirname, 'dist'),
           port: 3000,
       },
   };