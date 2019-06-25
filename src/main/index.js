import {
  app,
  BrowserWindow,
  dialog
} from 'electron'
// import '../renderer/store';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

const {
  ipcMain
} = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 662,
    useContentSize: true,
    width: 974,
    frame: false,
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  /**
   *  ipcMain
   */

   // 关闭
  ipcMain.on('closeWindow', () => {
    mainWindow.close();
    mainWindow = null;
  });

  // 最小化
  ipcMain.on('minimizeWindow', () => {
    mainWindow.minimize();
  });

  // 最大化
  ipcMain.on('resizeWindow', () => {
    mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
  });

  // 保存配置
  ipcMain.on('saveConfig', (e, config) => {
    const dir = path.resolve(process.env['USERPROFILE'], 'texter');
    const configPath = path.resolve(dir, 'config.json');
    const configString = JSON.stringify(config);
    fs.writeFile(configPath, configString, (err) => {
      let error;
      if(err) {
        error = err;
      }
      mainWindow.webContents.send('saveConfigResult', error);
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
      if(err && err.code === 'ENOENT') {
        let hasDir = fs.exists(dir);
        if(!hasDir) fs.mkdirSync(dir);
        fs.writeFile(configPath, JSON.stringify(defaultConfig), (error) => {
          if(error) {
            mainWindow.webContents.send('getConfig', error);
            return;
          }
          mainWindow.webContents.send('getConfig', null, defaultConfig);
        });
      } else {
        if(err) {
          error = err;
          config = defaultConfig;
        } else {
          config = JSON.parse(content);
        }
        mainWindow.webContents.send('getConfig', error, config);
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
        mainWindow.webContents.send('write-done', false, err);
        return;
      }
      mainWindow.webContents.send('write-done', true);
    });
  });

  // 获取保存的路径
  ipcMain.on('requestPath', (e, {
    title,
    defaultPath,
    type
  }) => {
    // let path = app.getPath('home');
    // mainWindow.webContents.send('responsePath', path);
    dialog.showSaveDialog(mainWindow, {
        title,
        defaultPath,
        filters: [{
          name: 'Markdown File',
          extensions: ['md']
        }]
      },
      filename => {
        if (type === 'saveFile') {
          mainWindow.webContents.send('responsePath', filename);
          return;
        }
        if(type === 'newFile') {
          mainWindow.webContents.send('responsePath-newFile', filename);
          return;
        }
      }
    );
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */