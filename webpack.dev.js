const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = merge(common, {
    mode: "development",
    devtool: "source-map", // Generate source maps for debugging
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader", 
                    "css-loader", 
                    "sass-loader" 
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader", 
                    "css-loader"
                ],
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'var',
        library: 'Client',
        clean: true,
    },
    optimization: {
        minimize: false, // Disable minimization in development
        minimizer: [
            new CssMinimizerPlugin(), 
        ],
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        open: true, 
    },
    plugins: [
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
