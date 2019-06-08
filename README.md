# babel-plugin-filenamespace

Babel plugin to generate a namespace _(a.k.a string)_ based on filename.

[![Build Status](https://travis-ci.org/samit4me/babel-plugin-filenamespace.svg?branch=master)](https://travis-ci.org/samit4me/babel-plugin-filenamespace)
[![Build status](https://ci.appveyor.com/api/projects/status/j63t7l2wwaqu3h0i?svg=true)](https://ci.appveyor.com/project/samit4me/babel-plugin-filenamespace)
[![Coverage Status](https://coveralls.io/repos/github/samit4me/babel-plugin-filenamespace/badge.svg?branch=master)](https://coveralls.io/github/samit4me/babel-plugin-filenamespace?branch=master)
[![dependencies Status](https://david-dm.org/samit4me/babel-plugin-filenamespace/status.svg)](https://david-dm.org/samit4me/babel-plugin-filenamespace)
[![devDependencies Status](https://david-dm.org/samit4me/babel-plugin-filenamespace/dev-status.svg)](https://david-dm.org/samit4me/babel-plugin-filenamespace?type=dev)


## Description

Directories and filenames are typically descriptive by nature, which make them great for namespacing your code.

> Think redux action types, unit test describe blocks or for organising storybook stories.

The node modules [__dirname][__dirname] and [__filename][__filename] are perfect for this, but there is a problem, with code bundling and client-side JS these modules lose their meaning. The purpose of this plugin is to give that meaning back.

```javascript
// src/components/Button.test.js
describe(__filenamespace, () => {
  it('should ...', () => {
    // ...
  })
})
```
```javascript
// is transformed into
describe('src/components/Button', () => {
  it('should ...', () => {
    // ...
  })
})
```

## Installation

```
npm install --save-dev babel-plugin-filenamespace
```

## Usage
Via `.babelrc` (Recommended)
```json
{
  "plugins": [
    "filenamespace"
  ]
}
```
or via `package.json`
```json
{
  "babel": {
    "plugins": [
      "filenamespace"
    ]
  }
}
```

Using [ESLint][eslint]? Add **__filenamespace** as a global

```json
{
  "globals": {
    "__filenamespace": false
  }
}
```

Then in any file you want a filename based namespace generated use the placeholder **__filenamespace**.

### Options

Use Babel's plugin options by replacing the plugin string with an array of the plugin name and an object with the options:
- `root`: *(Default: project root)* - specify your own root directory (e.g. src).
- `separator`: *(Default: "/")* - specify your own directory separator.
- `dropAllFilenames`*: *(Default: false)* - setting to true will exclude the filenames and use the directory structure only.
   - _**Note:** `index` files or filenames that match the parent directory name do not provide meaning, so the filename is always dropped_.
- `dropExtensions`**: *(Default: [".spec", ".test", ".story", ".stories"])* - specify the extensions you want removed.
   - _**Note:** file extension are always removed, these extensions for naming conventions (e.g. `path/to/file.test.js` will transform to `path/to/file`)_.
- `customPlaceholders`: *(Default: [])* - starting with **v2** you can configure multiple custom placeholders, each with their own configuration made up of the options above e.g. `[{ "placeholder": "__testnamespace", "separator": "." }]`.

## Examples

#### `root` example:
```json
{
  "plugins": [
    [
      "filenamespace",
      {
        "root": "app",
      }
    ]
  ]
}
```

```javascript
// app/container/App/data/file.js
const namespace = __filenamespace;
```
```javascript
// is transformed into
const namespace = 'container/App/data/file';
```

#### `separator` example:
```json
{
  "plugins": [
    [
      "filenamespace",
      {
        "separator": "👌"
      }
    ]
  ]
}
```

```javascript
// app/container/App/data/file.js
const namespace = __filenamespace;
```
```javascript
// is transformed into
const namespace = 'app👌container👌App👌data👌file';
```

#### `dropAllFilenames` example:
```json
{
  "plugins": [
    [
      "filenamespace",
      {
        "dropAllFilenames": true
      }
    ]
  ]
}
```

```javascript
// app/container/HomePage/Home.js
const namespace = __filenamespace;
```
```javascript
// is transformed into
const namespace = 'app/container/HomePage';
```

#### `dropExtensions` example:
```json
{
  "plugins": [
    [
      "filenamespace",
      {
        "dropExtensions": [".test"]
      }
    ]
  ]
}
```

```javascript
// app/container/HomePage/Home.test.js
const namespace = __filenamespace;
```
```javascript
// is transformed into
const namespace = 'app/container/HomePage/Home';
```

#### `customPlaceholders` extension:

```json
{
  "plugins": [
    [
      "filenamespace",
      {
        "separator": "."
        "customPlaceholders": [
          { "placeholder": "__dotDot", "separator": ".." },
          { "placeholder": "__dotDotDot", "separator": "..." }
        ]
      }
    ]
  ]
}
```

```javascript
// app/container/App/data/file.js
const namespace = __filenamespace;
const dotDotNamespace = __dotDot;
const dotDotDotNamespace = __dotDotDot;
```
```javascript
// is transformed into
const namespace = 'container.App.data.file';
const dotDotNamespace = 'container..App..data..file';
const dotDotDotNamespace = 'container...App...data...file';
```

## License

MIT, see [LICENSE](LICENSE) for details.

[redux]: https://github.com/reactjs/redux
[babel]: https://babeljs.io
[eslint]: http://eslint.org/
[__dirname]: https://nodejs.org/api/modules.html#modules_dirname
[__filename]: https://nodejs.org/api/modules.html#modules_filename
