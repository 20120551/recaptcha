const path = require("path");
const HandlebarsPlugin = require("handlebars-webpack-plugin");

module.exports = {
    mode: "production",
    target: "node",
    entry: {
        app: "./src/index.js"
    },
    output: {
        filename: "index.js",
        path: path.join(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.js$/
        }]
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"],
        plugins: [new HandlebarsPlugin({
            entry: path.join(__dirname, "src", "*.hbs"),
            output: path.join(__dirname, "dist", "[name].html"),
        })]
    }
}