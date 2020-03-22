const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new PrerenderSPAPlugin({
      // Required - The path to the webpack-outputted app to prerender.
      staticDir: path.join(__dirname, 'dist'),
      // Required - Routes to render.
      routes: [ '/', '/test', '/examples', '/examples/single-select', '/examples/multi-select','/examples/date-picker'],
    })
  ]
});
