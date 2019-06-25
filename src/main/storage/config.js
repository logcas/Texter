const path = require('path');

export const dirname = path.resolve(process.env['USERPROFILE'], '.texter');
export const filename = path.resolve(dirname, 'config.json');

export const defaultConfig = {
  "common": {
    "language": "zh-CN",
    "theme": "light"
  }
};