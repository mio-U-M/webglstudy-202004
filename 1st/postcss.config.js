const readConfig = require('read-config');

// base config
const SRC = './src'
const DEST = './public'

const constants = readConfig(`${SRC}/constants.yml`)
const { IMG_DIR } = constants

module.exports = {
  plugins: [
    // ベンダープレフィックスを自動付与する
    require('autoprefixer')(),
    require('css-mqpacker')(),
    require('postcss-assets')({
        basePath: `${DEST}`,
        loadPaths: [`.${IMG_DIR}/`],
    })
  ],
};