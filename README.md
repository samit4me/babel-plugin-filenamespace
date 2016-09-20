# babel-plugin-filenamespace

Babel plugin to generate a namespace based on filename.

[![Coverage Status](https://coveralls.io/repos/github/samit4me/babel-plugin-filenamespace/badge.svg?branch=master)](https://coveralls.io/github/samit4me/babel-plugin-filenamespace?branch=master)

## Description

Directories and filenames are typically descriptive by nature, which make them great for namespacing your code.

With modern JS tooling like Babel and Weback using something like `__dirname` or `__filename` can loose it’s meaning due to code bundling. The aim of this plugin is to give that meaning back, by transforming the value `__filenamespace` into a configurable static string representing the filename and path.

Originally this was created to help reduce the Boilerplate associated with namespacing [Redux][redux] **Action Types** in large applications. Namespacing [Redux][redux] actions become necessary to avoid conflicts and once you start separating your actions into separate files, this plugin really helps reduce that boilerplate.

## Usage Instructions

### Requirements

This is a [Babel][babel] plugin and will requires Babel v6 to run.

### Installation

Install the plugin

```
$ npm i -D babel-plugin-filenamespace
```

### Usage

Specify the plugin in your `.babelrc` with the custom configuration.

```json
{
  "plugins": [
    "filenamespace"
  ]
}
```

**Or In package.json:**

```json
{
  "babel": {
    "plugins": [
      "filenamespace"
    ]
  }
}
```

If you are using [ESLint][eslint] add __filenamespace as a global

```json
{
  "globals": {
    "__filenamespace": false
  }
}
```

Then in any file you want a filename based namespace generated use the keyword **__filenamespace**.

### Example:

Given the directory structure:

```
app
|__ components
|   |__ ListItem
|       |__index.js
|__ containers
|   |__ App
|       |__ index.js
|       |__ data
|           |__ index.js
|           |__ actions.js
|   |__ HomePage
|__ package.json
```

In `app/container/App/data/index.js`

```javascript
// Something like this
const moduleNamespace = __filenamespace;

// Will be transformed into something like this (index is meaningless so it is dropped)
const moduleNamespace = 'app/containers/App/data';
```


In `app/container/App/data/actions.js`

```javascript
// Something like this
const moduleNamespace = __filenamespace;

// Will be transformed into something like this
const moduleNamespace = 'app/containers/App/data/actions';

// Which allows you to reduce boilerplate and conflicts
const LOAD_DATA = `${__filenamespace}/LOAD_DATA`;
const LOAD_DATA_SUCCESS = `${__filenamespace}/LOAD_DATA_SUCCESS`;
const LOAD_DATA_ERROR = `${__filenamespace}/LOAD_DATA_ERROR`;
```

### Options

Use Babel's plugin options by replacing the plugin string with an array of the plugin name and an object with the options:

#### Example 1:
```json
{
  "plugins": [
    [
      "filenamespace",
      {
        "root": "app",
        "separator": "."
      }
    ]
  ]
}
```

In `app/container/App/data/index.js`

```javascript
// Something like this
const moduleNamespace = __filenamespace;

// Will be transformed into something like this
const moduleNamespace = 'containers.App.data';
```

#### Example 2:
```json
{
  "plugins": [
    [
      "filenamespace",
      {
        "root": "../",
        "separator": "👌"
      }
    ]
  ]
}
```

In `app/container/App/data/index.js`

```javascript
// Something like this
const moduleNamespace = __filenamespace;

// Will be transformed into something like this
const moduleNamespace = 'projectFolder👌app👌containers👌App👌data';
```

## License

MIT, see [LICENSE](LICENSE) for details.

[redux]: https://github.com/reactjs/redux
[babel]: https://babeljs.io
[eslint]: http://eslint.org/
