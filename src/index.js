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

        // Get namespace root directory (defaults to projectRoot)
        // modified via user specified plugin option "root"
        let userSetRoot = root;
        let namespaceRoot = sourceRoot;
        if (userSetRoot) {
          // remove leading ./ (if it exists) as it adds no value
          const dotSlash = userSetRoot.match(/^\.\//);
          if (dotSlash) {
            userSetRoot = userSetRoot.replace(/^\.\//, '');
          }
          // travel up from project dir if userRoot starts with ../, please note
          // that all ../ path segments will be used and all others will be ignored
          // for example:
          // ../ === start from projectFolder
          // ../../ === start from projectParentFolder
          // ../folderA/../ === start from projectParentFolder (folderA is ignored)
          const dotDotSlash = userSetRoot.match(/^\.\.\//);
          if (dotDotSlash) {
            const sourcePathSegments = namespaceRoot.split('/');
            const rootPathSegments = userSetRoot.split('/');
            namespaceRoot = rootPathSegments
              .filter(val => val.match(/^\.\.$/))
              .reduce(acc => acc.slice(0, -1), sourcePathSegments)
              .join('/');
          }
        }

        // Set namespace root by stripping out unwanted path segments
        // example one:
        // If the babel plugin option root: '../' was set
        // "C:\Users\sam\myProject" would become "myProject"
        // example two:
        // If the babel plugin option root: './src' was set
        // "C:\Users\sam\myProject" would become "myProject/src"
        let filenamespace = dirname.replace(namespaceRoot, '');
        if (userSetRoot && filenamespace.startsWith(`/${userSetRoot}`)) {
          filenamespace = filenamespace.replace(userSetRoot, '');
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
