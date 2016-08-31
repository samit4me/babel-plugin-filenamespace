'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {
      Identifier: function Identifier(path, state) {
        if (path.node.name === "__filenamespace") {
          var _state$opts = state.opts;
          var seperator = _state$opts.seperator;
          var root = _state$opts.root;
          var _state$file$opts = state.file.opts;
          var filename = _state$file$opts.filename;
          var basename = _state$file$opts.basename;
          var sourceRoot = _state$file$opts.sourceRoot;

          var dirname = _path2.default.dirname(filename);
          var filenamespace = dirname.replace(sourceRoot + '/', '');
          if (root && filenamespace.startsWith(root)) {
            filenamespace = filenamespace.replace(root + '/', '');
          }
          if (basename !== 'index') {
            filenamespace += '/' + basename;
          }
          if (seperator) {
            filenamespace = filenamespace.replace(/\//g, seperator);
            filenamespace += seperator;
          } else {
            filenamespace += '/';
          }
          path.replaceWith(t.stringLiteral(filenamespace));
        }
      }
    }
  };
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }