const nodePath = require('path');

export default ({ types: t }) => ({
  visitor: {
    Identifier(path, state) {
      if (path.node.name === '__filenamespace') {
        // Get user settings
        const { separator, root } = state.opts;

        // Get file paths
        const { filename, basename, sourceRoot } = state.file.opts;
        const dirname = nodePath.dirname(filename);

        // Set base directory (project source + root specified)
        let userSetRoot = root;
        let projectSrc = sourceRoot;
        if (root) {
          const dotSlash = root.match(/^\.\//);
          const dotDotSlash = root.match(/^\.\.\//);
          if (dotSlash) {
            userSetRoot = userSetRoot.replace(/^\.\//, '');
          }
          if (dotDotSlash) {
            const sourcePathSegments = sourceRoot.split('/');
            const rootPathSegments = userSetRoot.split('/');
            projectSrc = rootPathSegments
              .filter(val => val.match(/^\.\.$/))
              .reduce(acc => acc.slice(0, -1), sourcePathSegments)
              .join('/');
          }
        }

        let filenamespace = dirname.replace(`${projectSrc}`, '');
        if (userSetRoot && filenamespace.startsWith(`/${userSetRoot}`)) {
          filenamespace = filenamespace.replace(`${userSetRoot}`, '');
        }

        // Remove filename if "index" as it is meaningless
        if (!basename.match(/index/i)) {
          filenamespace += `/${basename}`;
        }

        // Strip leading path separators
        filenamespace = filenamespace.replace(/^\/+/, '');

        // Set custom separator
        if (separator) {
          filenamespace = filenamespace.replace(/\//g, separator);
        }

        // Replace __filenamespace with the transformed value
        path.replaceWith(t.stringLiteral(filenamespace));
      }
    },
  },
});
