const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    devtool: "hidden-source-map",
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader, // Extract CSS into separate file
                    "css-loader", // Translates CSS into CommonJS
                    "sass-loader" // Compiles Sass to CSS
                ],
            },
            {
                test: /\.css$/i, // Handle CSS files
                use: [
                    MiniCssExtractPlugin.loader, 
                    "css-loader"
                ]
            }
        ]
    },
    output: {
        filename: 'bundle.[contenthash].js', // Add contenthash for cache busting
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'var',
        library: 'Client',
        clean: true,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(), // Minimize CSS
            new TerserPlugin() // Minimize JavaScript
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash].css' // Add contenthash for cache busting
        }),
        new GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [
                {
                    urlPattern: /\.(?:js|css|html|png|jpg|jpeg|gif|svg)$/,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'assets',
                        expiration: {
                            maxEntries: 50,
                            maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                        },
                    },
                },
            ],
        })
    ]
});
