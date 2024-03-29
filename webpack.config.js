//webpack.config.js
const path = require("path");

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: {
        payload: "./src/inject.ts",
        background: "./src/background.ts",
        content: "./src/content.ts",
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name]-bundle.js", // <--- Will be compiled to this single file
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
        ],
    },
};
