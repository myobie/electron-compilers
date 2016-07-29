'use strict';

var filenames = [
// 'css/less',
'css/postcss',
// 'css/stylus',
'js/babel',
// 'js/coffeescript',
// 'js/typescript',
// 'json/cson',
'html/inline-html',
// 'html/jade',
'passthrough'];

module.exports = filenames.map(function (x) {
  return require('./' + x).default;
});