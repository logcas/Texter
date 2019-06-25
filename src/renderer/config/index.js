const { ipcRenderer } = require('electron');

function storeConfig(vm, confType, key, value) {
  if(!vm || !confType || !key || !value) return;
  vm.$store.dispatch('Config/setConfig', {
    [confType]: {
      [key]: value
    }
  });
  ipcRenderer.send('saveConfig', {
    ...vm.$store.state.Config
  });
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
        value: 'Light'
      },
      {
        label: 'Dark',
        value: 'Dark'
      }
    ],
    handler(vm, key, value) {
      console.log('set theme:', value);
    }
  }
};

export const input = {};

export default {
  common,
  input
};