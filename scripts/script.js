const fs = require('fs');
const path = require('path');

console.log('Making last minutes changes... \n');

const ORIG_PKG_PATH = path.resolve(__dirname, '../package.json');
const DEST = path.resolve(__dirname, '../dist/package.json');

const pkgData = require(ORIG_PKG_PATH);

delete pkgData.scripts['compile:dev'];
delete pkgData.scripts['compile:prod'];
delete pkgData.scripts['test'];
delete pkgData.scripts['postcompile:dev'];
delete pkgData.scripts['postcompile:prod'];
delete pkgData.scripts['test:ci'];
delete pkgData.scripts['copy:package'];
delete pkgData.devDependencies;
delete pkgData.dependencies;

console.log('1. Writing new package.json file \n');

fs.writeFileSync(DEST, JSON.stringify(pkgData, null, 2), (err) => {
  if (err) throw err;
});
console.log('2. Copying readme.md \n');

fs.copyFileSync(path.resolve(__dirname, '../readme.md'), path.resolve(__dirname, '../dist/readme.md'));

console.log('Build completed ;)\n ');
