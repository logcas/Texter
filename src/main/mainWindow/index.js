import {
  BrowserWindow
} from 'electron';
import options from './config';
import ipcMixin from './ipc';

export default (win, url) => () => {
  win = new BrowserWindow(options);
  win.loadURL(url);
  win.on('closed', () => win = null);
  ipcMixin(win);
};