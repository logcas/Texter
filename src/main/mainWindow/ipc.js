import {
  ipcMain,
  dialog
} from 'electron';
import db from '../storage';
const fs = require('fs');

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
  ipcMain.on('saveConfig', (e, confType, key, value) => {
    try {
      db.set(confType, {[key]: value}).write();
      win.webContents.send('saveConfigResult');
    } catch(error) {
      win.webContents.send('saveConfigResult', error);
    }
  });

  // 读配置文件
  ipcMain.on('loadConfig', () => {
    try {
      let config = db.read().value();
      win.webContents.send('getConfig', null, config);
    } catch(error) {
      win.webContents.send('getConfig', error, config);
    }
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