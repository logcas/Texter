import {
  ipcMain
} from 'electron';
const fs = require('fs');
const path = require('path');

export default function ipcMixin(win) {

  // 关闭
  ipcMain.on('closeWindow', () => {
    win.close();
    win = null;
  });

  // 最小化
  ipcMain.on('minimizeWindow', () => {
    win.minimize();
  });

  // 最大化
  ipcMain.on('resizeWindow', () => {
    win.isMaximized() ? win.restore() : win.maximize();
  });

  // 保存配置
  ipcMain.on('saveConfig', (e, config) => {
    const dir = path.resolve(process.env['USERPROFILE'], 'texter');
    const configPath = path.resolve(dir, 'config.json');
    const configString = JSON.stringify(config);
    fs.writeFile(configPath, configString, (err) => {
      let error;
      if (err) {
        error = err;
      }
      win.webContents.send('saveConfigResult', error);
    });
  });

  // 读配置文件
  ipcMain.on('loadConfig', () => {
    const dir = path.resolve(process.env['USERPROFILE'], 'texter');
    const configPath = path.resolve(dir, 'config.json');
    fs.readFile(configPath, (err, content) => {
      const defaultConfig = {
        'common': {
          language: 'zh-CN',
          theme: 'light'
        }
      };
      let error;
      let config;
      if (err && err.code === 'ENOENT') {
        let hasDir = fs.exists(dir);
        if (!hasDir) fs.mkdirSync(dir);
        fs.writeFile(configPath, JSON.stringify(defaultConfig), (error) => {
          if (error) {
            win.webContents.send('getConfig', error);
            return;
          }
          win.webContents.send('getConfig', null, defaultConfig);
        });
      } else {
        if (err) {
          error = err;
          config = defaultConfig;
        } else {
          config = JSON.parse(content);
        }
        win.webContents.send('getConfig', error, config);
      }
    })
  });

  // 写文件，保存文档
  ipcMain.on('saveFile', (e, file) => {
    const {
      path,
      content
    } = file;
    fs.writeFile(path, content, (err) => {
      if (err) {
        win.webContents.send('write-done', false, err);
        return;
      }
      win.webContents.send('write-done', true);
    });
  });

  // 获取保存的路径
  ipcMain.on('requestPath', (e, {
    title,
    defaultPath,
    type
  }) => {
    // let path = app.getPath('home');
    // win.webContents.send('responsePath', path);
    dialog.showSaveDialog(win, {
        title,
        defaultPath,
        filters: [{
          name: 'Markdown File',
          extensions: ['md']
        }]
      },
      filename => {
        if (type === 'saveFile') {
          win.webContents.send('responsePath', filename);
          return;
        }
        if (type === 'newFile') {
          win.webContents.send('responsePath-newFile', filename);
          return;
        }
      }
    );
  });

}