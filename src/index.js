const nodePath = require('path');

const normalisePathSep = path => (path
  ? path.replace(/\\/g, '/')
  : path
);
const removeLeadingDotSlash = path => (path && path.match(/^\.\//)
  ? path.replace(/^\.\//, '')
  : path
);

export default ({ types: t }) => ({
  visitor: {
    Identifier(path, state) {
      if (path.node.name === '__filenamespace') {
        // Get user settings
        const { separator, dropAllFilenames } = state.opts;
        const userSetRoot = removeLeadingDotSlash(normalisePathSep(state.opts.root));

        // Get file paths
        const cwd = normalisePathSep(state.cwd);
        const sourceRoot = normalisePathSep(state.file.opts.sourceRoot);
        const filename = normalisePathSep(state.file.opts.filename);
        const dirname = nodePath.dirname(filename);
        const basename = nodePath.basename(filename, nodePath.extname(filename));

        // Get namespace root directory (defaults to projectRoot)
        // modified via user specified plugin option "root"
        let namespaceRoot = sourceRoot || cwd;
        if (userSetRoot) {
          // travel up from project dir if userRoot starts with ../, please note
          // that all ../ path segments will be used and all others will be ignored
          // for example:
          // ../ === start from projectFolder
          // ../../ === start from projectParentFolder
          // ../folderA/../ === start from projectParentFolder (folderA is ignored)
          if (userSetRoot.match(/^\.\.\//)) {
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

        // Add filename to namespace
        // Do not add filename if either:
        // - The `dropAllFilenames` plugin option has been set to true, OR
        // - Filename is "index" as it is meaningless
        const addFilename = !dropAllFilenames && !basename.match(/index/i);
        if (addFilename) {
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
