'use strict';

var filenames = ['css/postcss', 'css/less', 'css/stylus', 'js/babel', 'js/coffeescript', 'js/typescript', 'json/cson', 'html/inline-html', 'html/jade', 'passthrough'];

module.exports = filenames.map(function (x) {
  return require('./' + x).default;
});