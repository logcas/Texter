/**
 *  file 文件结构
 *  {
 *     path: xxxx （文件的绝对路径）
 *     name: xxxx （文件名，包含扩展名）
 *     content: xxxxx （文件内容）
 *     lastModified: xxxx （上次修改的时间）
 *     type: xxx （文件类型 MIME TYPE）
 *     saveAfterModified: true / false （修改后是否已经保存）
 *  }
 */

let defaultFileStruct = { saveAfterModified: true };

const state = {
  fileList: {}, // 已打开的文件列表，以键值对形式，绝对路径为键名，file 结构为值
  currentFile: null, // 目前正在编辑的文件，值为文件的绝对路径
  isChangeFile: false, // 是否打开另一个文档 如果是，则逻辑不是修改
};

const getters = {
  editingFile(state) {
    return (state.currentFile && state.fileList[state.currentFile]) || null;
  },
  fileList(state) {
    return state.fileList;
  },
  currentFile(state) {
    return state.currentFile;
  },
  currentCode(state) {
    let path = state.currentFile;
    if(!path) return '';
    let file = state.fileList[path];
    if(!file) return '';
    return file.content;
  },
  isChangeFile(state) {
    return state.isChangeFile;
  }
};

const mutations = {
  setCurrentFile(state, path) {
    if(state.fileList[path] === null) return;
    state.currentFile = path;
  },
  addFile(state, file) {
    file = Object.assign({}, file, defaultFileStruct);
    const { path } = file;
    if(!path || state.fileList[path]) return;
    state.fileList = {
      ...state.fileList,
      [path]: file
    };
  },
  removeFile(state, path) {
    if(!path || state.fileList[path] === null) return;
    let o = {};
    for(let p in state.fileList) {
      if(state.fileList.hasOwnProperty(p) && p !== path) {
        o[p] = state.fileList[p];
      }
    }
    if(state.currentFile === path) state.currentFile = null;
    state.fileList = o;
    console.log(o);
  },
  modifyFile(state) {
    if(!state.currentFile || state.fileList[state.currentFile] === null) return;
    state.fileList[state.currentFile].saveAfterModified = false;
  },
  saveFile(state, path) {
    if(!path || state.fileList[path] === null) return;
    state.fileList[path].saveAfterModified = true;
  },
  setFileContent(state, content) {
    if(!content || !state.currentFile) return;
    state.isChangeFile = false;
    state.fileList[state.currentFile].content = content;
  },
  changeFile(state) {
    state.isChangeFile = true;
  }
};

const actions = {
  setCurrentFile({ commit }, path) {
    commit('setCurrentFile', path);
  },
  addFile({ commit }, file) {
    commit('addFile', file);
  },
  removeFile({ commit }, path) {
    commit('removeFile', path);
  },
  modifyFile({ commit }) {
    commit('modifyFile');
  },
  saveFile({ commit }, path) {
    commit('saveFile', path);
  },
  setFileContent({ commit }, content) {
    commit('setFileContent', content);
  },
  changeFile({ commit }) {
    commit('changeFile');
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};