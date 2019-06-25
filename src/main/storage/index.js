import { filename, dirname, defaultConfig } from './config';
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

let firstLoad = false;
if(!fs.existsSync(filename)) {
  !fs.existsSync(dirname) && fs.mkdirSync(dirname);
  fs.writeFileSync(filename, '');
  firstLoad = true;
}

const _adapter = new FileSync(filename);
const _db = low(_adapter);
if(firstLoad) _db.defaults(defaultConfig).write();

export default _db;
