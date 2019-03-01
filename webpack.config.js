const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const PATH_SOURCE = path.resolve(process.cwd(), 'src');
const PATH_DIST = path.resolve(process.cwd(), 'build');

const entry = {
    'capture': './src/capture.js',
    'crystalline': './src/crystalline.js',
};

const html = Object.keys(entry).map((key) => {
    return new HTMLWebpackPlugin({
        inject: false,
        hash: true,
        title: key,
        capture: key === 'capture',
        js: `js/${key}.js`,
        template: path.join(PATH_SOURCE, 'template.html'),
        filename: path.join(PATH_DIST, `${key}.html`),
    });
});

module.exports = {
    mode: 'development',
    entry,
    output: {
        path: PATH_DIST,
        filename: 'js/[name].js'
    },
    resolve: {
        alias: {
            app: PATH_SOURCE,
        },
    },
    plugins: [
        new CleanWebpackPlugin([PATH_DIST], { verbose: false, root: process.cwd() }),
    ].concat(html),
};
