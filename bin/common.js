const path = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');

const appExists = (appName = false) => existsSync(`./apps/${appName}`);

const readJsonFile = (filePath) => {
  const content = readFileSync(filePath);
  return JSON.parse(content);
};

const writeJsonFile = (filePath, jsonContent) => {
  writeFileSync(filePath, JSON.stringify(jsonContent), 'utf8', (error) => {
    if (error) {
      console.error(error);
    }
  });
};

module.exports = {
  scope: 'ts',
  appsPath: '/apps',
  packagesPath: '/packages',
  appExists,
  readJsonFile,
  writeJsonFile,
};
