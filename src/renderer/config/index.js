const { ipcRenderer } = require('electron');

function storeConfig(vm, confType, key, value) {
  if(!vm || !confType || !key || !value) return;
  vm.$store.dispatch('Config/setConfig', {
    [confType]: {
      [key]: value
    }
  });
  ipcRenderer.send('saveConfig', confType, key, value);
}

export const common = {
  language: {
    name: 'language',
    defaultValue: 'zh-CN',
    options: [{
        label: '简体中文',
        value: 'zh-CN'
      },
      {
        label: 'English',
        value: 'en-US'
      },
    ],
    handler(vm, key, value, init = false) {
      vm.$i18n.locale = value;
      if(init) return;
      storeConfig(vm, 'common', key, value);
    },
  },
  'theme': {
    defaultValue: 'Light',
    options: [{
        label: 'Light',
        value: 'light'
      },
      {
        label: 'Dark',
        value: 'dark'
      }
    ],
    handler(vm, key, value) {
      document.documentElement.setAttribute('type', value);
      switch(value) {
        case 'light': 
          import('../themes/light').then(() => {});
          break;
        case 'dark':
          import('../themes/dark').then(() => {});
          break;
      }
      storeConfig(vm, 'common', key, value);
    }
  }
};

export const input = {};

export default {
  common,
  input
};