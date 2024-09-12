const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: ['./src/client/index.js'], // Entry point for the application
    output: {
        filename: 'bundle.js', // Output filename
        path: path.resolve(__dirname, 'dist'), // Output directory
        clean: true, // Clean output directory before each build
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Apply Babel loader to JavaScript files
                exclude: /node_modules/, // Exclude node_modules directory
                use: {
                    loader: 'babel-loader', // Use Babel to transpile JavaScript
                    options: {
                        presets: ['@babel/preset-env'], // Use the preset-env for modern JavaScript
                    },
                },
            },
            {
                test: /\.s[ac]ss$/i, // Apply loaders to SCSS and SASS files
                use: [
                    'style-loader', // Inject CSS into the DOM
                    'css-loader', // Translate CSS into CommonJS
                    'sass-loader', // Compile SCSS/SASS to CSS
                ],
            },
            {
                test: /\.css$/i, // Apply loaders to CSS files
                use: [
                    'style-loader', 
                    'css-loader'
                ]
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/views/index.html', // HTML template for the build
            filename: 'index.html', // Output filename for HTML
        }),
        new CleanWebpackPlugin({
            dry: false, // Don't use dry mode
            verbose: true, // Log cleaned files
            cleanStaleWebpackAssets: true, // Clean up old assets
            protectWebpackAssets: false, // Don't protect existing assets from being cleaned
        }),
    ],
    resolve: {
        fallback: {
            path: require.resolve("path-browserify"),
            os: require.resolve("os-browserify/browser"),
            crypto: require.resolve("crypto-browserify")
        }
    }
};
