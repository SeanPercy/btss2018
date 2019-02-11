import * as path from "path";
import * as webpack from "webpack";

export const development: webpack.Configuration = {
    devServer: {
        contentBase: path.resolve(__dirname, "../../src"),
        host: "localhost",
        hotOnly: true,
        overlay: true,
        port: 8080,
        publicPath: "/",
        watchContentBase: true,
    },
    devtool: "cheap-module-eval-source-map",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [{
                    // Inject CSS to page
                    loader: "style-loader",
                }],
            },
        ],
    },
    optimization: {
        namedChunks: true,
        namedModules: true,
        usedExports: true,
    },
    output: {
        filename: "bundle.js",
        sourceMapFilename: "bundle.map",
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
};
