<div align="center">
<h1>babel-plugin-filenamespace 📂</h1>
<p>Babel plugin to generate a namespace <i>(a.k.a string)</i> based on filename.</p>

[![Build Status](https://travis-ci.org/samit4me/babel-plugin-filenamespace.svg?branch=master)](https://travis-ci.org/samit4me/babel-plugin-filenamespace)
[![Build status](https://ci.appveyor.com/api/projects/status/j63t7l2wwaqu3h0i?svg=true)](https://ci.appveyor.com/project/samit4me/babel-plugin-filenamespace)
[![Coverage Status](https://coveralls.io/repos/github/samit4me/babel-plugin-filenamespace/badge.svg?branch=master)](https://coveralls.io/github/samit4me/babel-plugin-filenamespace?branch=master)
[![dependencies Status](https://david-dm.org/samit4me/babel-plugin-filenamespace/status.svg)](https://david-dm.org/samit4me/babel-plugin-filenamespace)
[![devDependencies Status](https://david-dm.org/samit4me/babel-plugin-filenamespace/dev-status.svg)](https://david-dm.org/samit4me/babel-plugin-filenamespace?type=dev)

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

</div>

## 📄 Description

Directories and filenames are typically descriptive by nature, which make them great for namespacing your code.

> Think about [redux action types][reduxActionType], unit test [describe][jestDescribe] blocks, [storybook stories][storyNesting].

[__dirname][__dirname] and [__filename][__filename] are perfect for this, but with code bundling and client-side JS they lose their meaning. The purpose of this plugin is to give that meaning back.

```javascript
// src/components/Button.test.js
describe(__filenamespace, () => {})
```
```javascript
// is transformed into
describe('src/components/Button', () => {})
```

## 📦 Install

```
npm install --save-dev babel-plugin-filenamespace
```

## 🚀 Usage
Via `.babelrc`
```json
{
  "plugins": [
    "filenamespace"
  ]
}
```

Using [ESLint][eslint]?

```json
{
  "globals": {
    "__filenamespace": false
  }
}
```

Then in any file you want a filename based namespace generated use the placeholder **__filenamespace**.

## ⚙️ Options

Use Babel's plugin options by replacing the plugin string with an array of the plugin name and an object with the options:
- [`root`](#root): *(Default: project root)*
   - Specify root directory relative to project src (e.g. src).
- [`separator`](#separator): *(Default: "/")*
   - Specify directory separator.
- [`dropAllFilenames`](#dropallfilenames): *(Default: false)*
   - Setting to true will exclude all filenames and use directory structure only.
   - _**Note:** files named `index` OR have a name that match the parent directory (file extention ignored) are always dropped, regardless of this setting, as they do not provide meaning_.
- [`dropExtensions`](#dropextensions): *(Default: [".spec", ".test", ".story", ".stories"])*
   - Specify the extensions you want removed.
   - _**Note:** file extension are always removed, these extensions are for removing extensions from common file naming conventions (e.g. `path/to/file.test.js` will transform to `path/to/file`)_.
- [`customPlaceholders`](#customplaceholders): *(Default: [])*
   - Specify custom placeholders, each with their own configuration (all above options) e.g. `[{ "placeholder": "__testnamespace", "separator": "." }]`.

## ✨Examples

### `root`:
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

### `separator`:
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

### `dropAllFilenames`:
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

### `dropExtensions`:
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

### `customPlaceholders`:

```json
{
  "plugins": [
    [
      "filenamespace",
      {
        "separator": ".",
        "customPlaceholders": [
          {
            "placeholder": "__dotDot",
            "separator": ".."
          },
          {
            "placeholder": "__dotDotDot",
            "separator": "...",
            "root": "app",
            "dropAllFilenames": true
          }
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
const namespace = 'app.container.App.data.file';
const dotDotNamespace = 'app.container..App..data..file';
const dotDotDotNamespace = 'container...App...data';
```

## 🤝 Contributing
Contributions, issues and feature requests are welcome.<br />
Feel free to check the [Contributing](https://github.com/samit4me/babel-plugin-filenamespace/blob/master/CONTRIBUTING.md) page if you want to contribute.

## 📝 License

Copyright © 2019 [Samuel Sharpe](https://github.com/samit4me).<br />
This project is [MIT](https://github.com/samit4me/babel-plugin-filenamespace/blob/master/LICENSE) licensed.

[__dirname]: https://nodejs.org/api/modules.html#modules_dirname
[__filename]: https://nodejs.org/api/modules.html#modules_filename
[eslint]: http://eslint.org/
[jestDescribe]: https://jestjs.io/docs/en/api#describename-fn
[reduxActionType]: https://redux.js.org/basics/actions#actions
[storyNesting]: https://storybook.js.org/docs/basics/writing-stories/#nesting-stories
[github-watch-badge]: https://img.shields.io/github/watchers/samit4me/babel-plugin-filenamespace.svg?style=social
[github-watch]: https://github.com/samit4me/babel-plugin-filenamespace/watchers
[github-star-badge]: https://img.shields.io/github/stars/samit4me/babel-plugin-filenamespace.svg?style=social
[github-star]: https://github.com/samit4me/babel-plugin-filenamespace/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20babel-plugin-filenamespace!%20https://github.com/samit4me/babel-plugin-filenamespace%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/samit4me/babel-plugin-filenamespace.svg?style=social