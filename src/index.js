import nodePath from 'path';

export default ({ types: t }) => ({
  visitor: {
    Identifier(path, state) {
      if (path.node.name === '__filenamespace') {
        // Get user settings
        const { seperator, root } = state.opts;

        // Get file paths
        const { filename, basename, sourceRoot } = state.file.opts;
        const dirname = nodePath.dirname(filename);

        // Transform filename
        let filenamespace = dirname.replace(`${sourceRoot}/`, '');
        if (root && filenamespace.startsWith(root)) {
          filenamespace = filenamespace.replace(`${root}/`, '');
        }

        // Remove filename if "index" as it is meaningless
        if (basename !== 'index') {
          filenamespace += `/${basename}`;
        }

        // Set custom seperator
        if (seperator) {
          filenamespace = filenamespace.replace(/\//g, seperator);
        }

        // Replace __filenamespace with the transformed value
        path.replaceWith(t.stringLiteral(filenamespace));
      }
    },
  },
});
