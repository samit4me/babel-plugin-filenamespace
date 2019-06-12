const nodePath = require('path');

export const defaultDropExtensions = [
  '.spec',
  '.test',
  '.story',
  '.stories',
];

const normalisePathSep = path => (path
  ? path.replace(/\\/g, '/')
  : path
);
const removeLeadingDotSlash = path => (path && path.match(/^\.\//)
  ? path.replace(/^\.\//, '')
  : path
);
const buildPluginConfig = opts => ({
  dropAllFilenames: opts && opts.dropAllFilenames,
  dropExtensions: (opts && opts.dropExtensions) || defaultDropExtensions,
  separator: opts && opts.separator,
  userSetRoot: opts && removeLeadingDotSlash(normalisePathSep(opts.root)),
});
const getConfigIfNodeTransformable = (path, state) => {
  // Node matches default placeholder (added in v1).
  if (path.node.name === '__filenamespace') {
    return buildPluginConfig(state.opts);
  }
  // Node matches custom placeholder (added in v2).
  // Note: always choose 1st one if duplicates exist.
  const placeholder = (state.opts.customPlaceholders || [])
    .filter(x => x && x.placeholder === path.node.name)[0];
  if (placeholder) {
    return buildPluginConfig(placeholder);
  }
  // Not a transformable node.
  return false;
};

export default ({ types: t }) => ({
  visitor: {
    Identifier(path, state) {
      const pluginConfig = getConfigIfNodeTransformable(path, state);
      if (pluginConfig) {
        // Plugin config
        const {
          dropAllFilenames,
          dropExtensions,
          separator,
          userSetRoot,
        } = pluginConfig;

        // Get file paths
        const projectRoot = normalisePathSep(state.cwd);
        const filename = normalisePathSep(state.file.opts.filename);
        const dirname = nodePath.dirname(filename);
        const basename = [nodePath.extname(filename)].concat(dropExtensions).reduce(
          (acc, ext) => nodePath.basename(acc, ext),
          filename,
        );

        // Get namespace root directory (defaults to projectRoot)
        // modified via user specified plugin option "root"
        let namespaceRoot = projectRoot;
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
