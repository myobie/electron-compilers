'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _compilerBase = require('../compiler-base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var postcss = void 0;
var mimeTypes = ['text/css'];

var PostCSSCompiler = function (_CompilerBase) {
  _inherits(PostCSSCompiler, _CompilerBase);

  function PostCSSCompiler() {
    _classCallCheck(this, PostCSSCompiler);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PostCSSCompiler).call(this));

    _this.compilerOptions = {
      map: { inline: true }
    };
    _this.plugins = [];

    var possibleFile = _path2.default.join(process.cwd(), 'postcss.json');
    console.dir({ possibleFile: possibleFile });
    try {
      _fs2.default.statSync();
    } catch (e) {
      console.error(e);
      possibleFile = null;
    }
    if (possibleFile) {
      console.log('found file');
      try {
        var config = JSON.parse(_fs2.default.readFileSync(possibleFile));
        if (config && config.plugins) {
          _this.plugins = config.plugins;
        }
      } catch (e) {}
    }

    console.dir({ plugins: _this.plugins });
    _this.seenFilePaths = {};
    return _this;
  }

  _createClass(PostCSSCompiler, [{
    key: 'shouldCompileFile',
    value: function shouldCompileFile(fileName, compilerContext) {
      return true;
    }
  }, {
    key: 'determineDependentFiles',
    value: function determineDependentFiles(sourceCode, filePath, compilerContext) {
      return [];
    }
  }, {
    key: 'compile',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(sourceCode, filePath, compilerContext) {
        var compiler, plugins, thisPath, paths, opts, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.dir({ async: true, sourceCode: sourceCode, filePath: filePath });

                _context.prev = 1;

                if (!postcss) {
                  compiler = require('postcss');
                  plugins = this.plugins.map(function (name) {
                    return require(name);
                  });

                  postcss = compiler(plugins);
                }

                thisPath = _path2.default.dirname(filePath);

                this.seenFilePaths[thisPath] = true;

                paths = Object.keys(this.seenFilePaths);


                if (this.compilerOptions.paths) {
                  paths.push.apply(paths, _toConsumableArray(this.compilerOptions.paths));
                }

                opts = Object.assign({}, this.compilerOptions, {
                  paths: paths,
                  filename: _path2.default.basename(filePath)
                });
                _context.next = 10;
                return postcss.process(sourceCode, opts);

              case 10:
                result = _context.sent;


                console.log(result.css);

                return _context.abrupt('return', {
                  code: result.css,
                  mimeType: 'text/css'
                });

              case 15:
                _context.prev = 15;
                _context.t0 = _context['catch'](1);

                console.error(_context.t0);
                return _context.abrupt('return', {});

              case 19:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 15]]);
      }));

      function compile(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return compile;
    }()
  }, {
    key: 'shouldCompileFileSync',
    value: function shouldCompileFileSync(fileName, compilerContext) {
      return false;
    }
  }, {
    key: 'determineDependentFilesSync',
    value: function determineDependentFilesSync(sourceCode, filePath, compilerContext) {
      return [];
    }
  }, {
    key: 'compileSync',
    value: function compileSync(sourceCode, filePath, compilerContext) {
      throw new Error('sync compile not supported for postcss');
    }
  }, {
    key: 'getCompilerVersion',
    value: function getCompilerVersion() {
      return require('postcss/package.json').version;
    }
  }], [{
    key: 'getInputMimeTypes',
    value: function getInputMimeTypes() {
      return mimeTypes;
    }
  }]);

  return PostCSSCompiler;
}(_compilerBase.CompilerBase);

exports.default = PostCSSCompiler;