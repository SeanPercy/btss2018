import path from "path";

// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import CleanWebpackPlugin from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import OptimizeCssAssetsPlugin from "optimize-css-assets-webpack-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import webpack from "webpack";

export const production: webpack.Configuration = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }],
            },
        ],
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.optimize\.css$/g,
                canPrint: true,
                cssProcessor: require("cssnano"),
                cssProcessorPluginOptions: {
                    preset: ["default", { discardComments: { removeAll: true } }],
                },
            }),
        ],
        namedChunks: false,
        namedModules: false,
        removeEmptyChunks: true,
        runtimeChunk: true,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: "all",
                    minChunks: 2,
                    name: "vendors",
                    test: /[\\/]node_modules[\\/]/,
                },
            },
            chunks: "all",
        },
    },
    output: {
        chunkFilename: "[name].[chunkhash].js",
        filename: "[name].[chunkhash].bundle.js",
    },
    performance: {
        hints: "warning",
    },
    plugins: [
        new CleanWebpackPlugin(["dist"], {
            root: path.resolve(__dirname, "../../"),
        }),
        new MiniCssExtractPlugin({
            chunkFilename: "[name].[contenthash].css",
            filename: "[name].[contenthash].css",
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: "sourcemaps/[name].js.map",
            lineToLine: true,
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
            },
            template: path.resolve(__dirname, "../../src/template.html"),
            title: "ReactBabelTypeScriptWebpack",
        }),
        // new BundleAnalyzerPlugin()
    ],
};
