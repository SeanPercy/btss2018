import path from "path";

import Dotenv from "dotenv-webpack";
import webpack from "webpack";

export const common: webpack.Configuration = {
    context: path.resolve(__dirname, "../../src"),
    entry: "main.tsx",
    module: {
        rules: [
            {
                include: path.resolve(__dirname, "../../src"),
                /* exclude could be used as an alternative to package.json field sideEffects to avoid
                style-sheets being tree-shaked in production mode*/
                // exclude: /\.scss$/i,
                test: /\.(js|tsx?)$/i,
                use: [{
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: path.resolve(__dirname, "../../cache/babel"),
                        envName: process.env.NODE_ENV,
                    },
                }],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [{
                    // Translates CSS into CommonJS modules
                    // Interprets `@import` and `url()` like `import/require()` and will resolve them
                    loader: "css-loader",
                    options: {
                        importLoaders: 2,
                    },
                }, {
                    // Run postcss actions specified in the config file
                    loader: "postcss-loader",
                    options: {
                        config: {
                            path: path.join(__dirname, "../postcss.config.js"),
                        },
                    },
                }, {
                    // Loads a SASS/SCSS file and compiles it to CSS
                    loader: "sass-loader",
                }],
            },
            {
                test: /\.(png|jpg|svg)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        fallback: "file-loader",
                        limit: 20000,
                    },
                }],
            },
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                use: ["graphql-tag/loader"],
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, "../../dist/"),
        publicPath: "/",
    },
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, "../../...env"),
        }),
    ],
    resolve: {
        extensions: [".css", ".scss", ".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
        modules: [
            path.resolve(__dirname, "../../src"),
            "node_modules",
        ],
    },
};
