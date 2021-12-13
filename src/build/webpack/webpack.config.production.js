const webpackConfig = require('./webpack.config.global.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

webpackConfig.mode = 'production';
webpackConfig.devtool = 'source-map';
webpackConfig.optimization.minimize = true;
webpackConfig.optimization.minimizer = [new CssMinimizerPlugin(), new TerserPlugin()];
webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
        template: `${__dirname}/../../app/index.html`,
        inject: 'body',
        hash: true,
    })
);

module.exports = webpackConfig;
