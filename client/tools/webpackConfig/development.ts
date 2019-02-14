import path from "path";

import webpack from "webpack";

import { clientConfig} from "../../client-config";
const { dev: { host, port } } = clientConfig ;

export const development: webpack.Configuration = {
    devServer: {
        contentBase: path.resolve(__dirname, "../../src"),
        host,
        hotOnly: true,
        overlay: true,
        port,
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
