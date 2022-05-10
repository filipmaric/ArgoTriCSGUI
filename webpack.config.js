const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        GUI: './src/gui.js',
        JSON: './json/index.js'
    },
    output: {
        filename: '[name].js',
        library: {
            name: '[name]',
            type: 'umd',
        },
        path: path.resolve(__dirname, 'dist'),
    },
};
