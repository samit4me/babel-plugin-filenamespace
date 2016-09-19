import nodePath from 'path';

export default function ({ types: t }) {
  return {
    visitor: {
      Identifier(path, state) {
        if (path.node.name === '__filenamespace') {
          const { seperator, root } = state.opts;
          const { filename, basename, sourceRoot } = state.file.opts;
          const dirname = nodePath.dirname(filename);
          let filenamespace = dirname.replace(`${sourceRoot}/`, '');
          if (root && filenamespace.startsWith(root)) {
            filenamespace = filenamespace.replace(`${root}/`, '');
          }
          if (basename !== 'index') {
            filenamespace += `/${basename}`;
          }
          if (seperator) {
            filenamespace = filenamespace.replace(/\//g, seperator);
            filenamespace += seperator;
          } else {
            filenamespace += '/';
          }
          path.replaceWith(t.stringLiteral(filenamespace));
        }
      },
    },
  };
}
