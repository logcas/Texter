const states = {
  common: {
    language: 'zh-CN',
    theme: 'light'
  }
};

const getters = {
  commonConfig(state) {
    return state.common;
  }
};

const mutations = {
  setCommonConfig(state, config = {}) {
    state.common = {
      ...state.common,
      ...config
    };
  }
}

const actions = {
  setConfig({ commit }, config) {
    commit('setCommonConfig', config.common);
  },
}

export default {
  namespaced: true,
  states,
  getters,
  mutations,
  actions
};