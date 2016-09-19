import fs from 'fs';
import path from 'path';
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import { transformFileSync } from 'babel-core';

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

test('__filenamespace is transformed', () => {
  const fixture = 'basic';
  const actual = transformFileSync(getFixturePath(fixture), babelOptions).code;
  const expected = fs.readFileSync(getExpectedPath(fixture), { encoding: 'utf8' });
  expect(actual).toBe(expected);
});

test('__filenamespace is transformed with seperator specified', () => {
  const fixture = 'seperator';
  const options = Object.assign({}, babelOptions, {
    plugins: [
      [pluginPath, { seperator: '.' }],
    ],
  });
  const actual = transformFileSync(getFixturePath(fixture), options).code;
  const expected = fs.readFileSync(getExpectedPath(fixture), { encoding: 'utf8' });
  expect(actual).toBe(expected);
});
