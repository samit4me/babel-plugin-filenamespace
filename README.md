# babel-plugin-filenamespace

Babel plugin to generate a namespace based on filename.

## WARNING: still just an idea, no tests written, please do not use

## Description

An opinionated way to namespace JS modules, suitable for projects utilising the folder structure to better describe modules.  
This is an excellent way to generate namespacing for [Redux][redux] **Action Types** in large apps.

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

Then in any file you want a filename base namespace generated use the keyword **__filenamespace**.

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

// Will be transformed into something like this
const moduleNamespace = 'app/containers/App/data/';
```


In `app/container/App/data/actions.js`

```javascript
// Something like this
const moduleNamespace = __filenamespace;

// Will be transformed into something like this
const moduleNamespace = 'app/containers/App/data/actions/';

// Which allows you to reduce boilerplate and action conflicts
export const LOAD_DATA = `${moduleNamespace}LOAD_DATA`;
export const LOAD_DATA_SUCCESS = `${moduleNamespace}LOAD_DATA_SUCCESS`;
export const LOAD_DATA_ERROR = `${moduleNamespace}LOAD_DATA_ERROR`;
```

### Options

Use Babel's plugin options by replacing the plugin string with an array of the plugin name and an object with the options:

```json
{
  "plugins": [
    [
      "filenamespace",
      {
        "root": "app",
        "seperator": "."
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
const moduleNamespace = 'containers.App.data.';
```

## License

MIT, see [LICENSE](LICENSE) for details.

[redux]: https://github.com/reactjs/redux
[babel]: https://babeljs.io
