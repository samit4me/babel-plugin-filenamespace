import fs from 'fs';
import path from 'path';
import { transformFileSync } from '@babel/core';

// Common test data
const projectRoot = path.resolve(__dirname, '..');
const testFixturesRoot = path.resolve(__dirname, '..', 'testFixtures');
const pluginPath = path.resolve(__dirname, '..', 'lib');
const babelOptions = { sourceRoot: projectRoot, plugins: [pluginPath] };
const getTestFilePath = (pathSegments, filename) => {
  let testFilePath;
  let paths;
  if (typeof pathSegments === 'string') paths = [pathSegments];
  if (Array.isArray(pathSegments)) paths = pathSegments.slice();
  if (paths && filename && typeof filename === 'string') {
    testFilePath = path.resolve(...[testFixturesRoot, ...paths, filename]);
  }
  return testFilePath;
};
const getFixturePath = pathSegments => getTestFilePath(pathSegments, 'fixture.js');
const getExpectedPath = pathSegments => getTestFilePath(pathSegments, 'expected.js');
const getExpectedOutput = pathSegments => fs.readFileSync(getExpectedPath(pathSegments), {
  encoding: 'utf8',
});

// No transform test
it('should leave file as is if no __filenamespace is present', () => {
  const fixture = 'noTransformation';
  const actual = transformFileSync(getFixturePath(fixture), babelOptions).code;
  const expected = fs.readFileSync(getExpectedPath(fixture), { encoding: 'utf8' });
  expect(actual).toBe(expected);
});

// Basic no frills transform test
it('__filenamespace is transformed', () => {
  const fixture = 'basic';
  const actual = transformFileSync(getFixturePath(fixture), babelOptions).code;
  const expected = fs.readFileSync(getExpectedPath(fixture), { encoding: 'utf8' });
  expect(actual).toBe(expected);
});

// Files with the name "index" have no meaning and should be ommitted
it('should omit filename of "index" regardless of cASe', () => {
  const fixture = 'omitIndex';
  const fixturePath = getTestFilePath(fixture, 'INdex.js');
  const actual = transformFileSync(fixturePath, babelOptions).code;
  expect(actual).toBe(getExpectedOutput(fixture));
});

// Separate path segments using a dot
it('should separate path segments with a dot "."', () => {
  const fixture = ['separator', 'dot'];
  const options = Object.assign({}, babelOptions, {
    plugins: [
      [pluginPath, { separator: '.' }],
    ],
  });
  const actual = transformFileSync(getFixturePath(fixture), options).code;
  const expected = fs.readFileSync(getExpectedPath(fixture), { encoding: 'utf8' });
  expect(actual).toBe(expected);
});

// Separate path segments using an emoji 👌 (aka upside down circle punch game)
it('should separate path segments with an emoji 👌', () => {
  const fixture = ['separator', 'emoji'];
  const options = Object.assign({}, babelOptions, {
    plugins: [
      [pluginPath, { separator: '👌' }],
    ],
  });
  const actual = transformFileSync(getFixturePath(fixture), options).code;
  const expected = fs.readFileSync(getExpectedPath(fixture), { encoding: 'utf8' });
  expect(actual).toBe(expected);
});

// Specifying a root directory as one of the folders living in the project root
it('should start the namespace one folder deeper than project src', () => {
  const fixture = ['root', 'singleFolder'];
  const options = Object.assign({}, babelOptions, {
    plugins: [
      [pluginPath, { root: 'testFixtures' }],
    ],
  });
  const actual = transformFileSync(getFixturePath(fixture), options).code;
  const expected = fs.readFileSync(getExpectedPath(fixture), { encoding: 'utf8' });
  expect(actual).toBe(expected);
});

// Specifying a root directory as a path (ONLY forward slashes are excepted)
it('should start the namespace from the root path specified', () => {
  const fixture = ['root', 'path'];
  const options = Object.assign({}, babelOptions, {
    plugins: [
      [pluginPath, { root: 'testFixtures/root/path' }],
    ],
  });
  const actual = transformFileSync(getFixturePath(fixture), options).code;
  const expected = fs.readFileSync(getExpectedPath(fixture), { encoding: 'utf8' });
  expect(actual).toBe(expected);
});

// Specifying a root directory using ../
it('should start the namespace with the project folder', () => {
  const fixture = ['root', 'projectFolder'];
  const options = Object.assign({}, babelOptions, {
    plugins: [
      [pluginPath, { root: '../' }],
    ],
  });
  const actual = transformFileSync(getFixturePath(fixture), options).code;
  const expected = fs.readFileSync(getExpectedPath(fixture), { encoding: 'utf8' });
  expect(actual).toBe(expected);
});

// Specifying a root directory using ../../
it('should start the namespace with the projects parent folder', () => {
  const fixture = ['root', 'projectFolder'];
  const options = Object.assign({}, babelOptions, {
    plugins: [
      [pluginPath, { root: '../../' }],
    ],
  });
  // cannot possibly know the parent folder of the project outside of
  // my own computer, so just checking if it ends correctly
  const actual = transformFileSync(getFixturePath(fixture), options).code
    .endsWith('/babel-plugin-filenamespace/testFixtures/root/projectFolder/fixture";');
  expect(actual).toBe(true);
});

// Specifying a root directory using ./basic
it('should start the namespace as per basic test and ignore leading ./', () => {
  const fixture = 'basic';
  const options = Object.assign({}, babelOptions, {
    plugins: [
      [pluginPath, { root: './basic' }],
    ],
  });
  const actual = transformFileSync(getFixturePath(fixture), options).code;
  const expected = fs.readFileSync(getExpectedPath(fixture), { encoding: 'utf8' });
  expect(actual).toBe(expected);
});

// Plugin option `dropAllFilenames` tests
it('should omit all filenames when dropAllFilenames: true', () => {
  const fixture = 'dropAllFilenames';
  const options = Object.assign({}, babelOptions, {
    plugins: [
      [pluginPath, { dropAllFilenames: true }],
    ],
  });
  const actual = transformFileSync(getFixturePath(fixture), options).code;
  const expected = fs.readFileSync(getExpectedPath(fixture), { encoding: 'utf8' });
  expect(actual).toBe(expected);
});
