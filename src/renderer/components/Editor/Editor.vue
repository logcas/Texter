<template>
  <div class="editor" style="height: 100%;">
    <transition name="fold">
      <filebar v-show="!hideFileBar"/>
    </transition>
    <div class="editor-wrapper" :class="{
      expand: hideFileBar
    }">
      <div class="editor-header">
        <ul class="editor-header-button-group">
          <li class="editor-header-button" @click="onFoldPanel">
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t('editor.expandOrFoldPanel') }}</span>
              </template>
              <a-icon
                type="arrow-left"
                :class="{
                expand: hideFileBar
              }"
              />
            </a-tooltip>
          </li>
          <li class="editor-header-button" @click="onSave">
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t('editor.save') }}</span>
              </template>
              <a-icon type="save"/>
            </a-tooltip>
          </li>
          <li class="editor-header-button" @click="onExport">
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t('editor.saveAs') }}</span>
              </template>
              <a-icon type="export"/>
            </a-tooltip>
          </li>
          <li
            class="editor-header-button"
            :class="{ current: mode === 'edit' }"
            @click="changeMode('edit')"
          >
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t('editor.editMode') }}</span>
              </template>
              <a-icon type="edit"/>
            </a-tooltip>
          </li>
          <li
            class="editor-header-button"
            :class="{ current: mode === 'classic' }"
            @click="changeMode('classic')"
          >
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t('editor.classicMode') }}</span>
              </template>
              <a-icon type="profile"/>
            </a-tooltip>
          </li>
          <li
            class="editor-header-button"
            :class="{ current: mode === 'reading' }"
            @click="changeMode('reading')"
          >
            <a-tooltip placement="bottom">
              <template slot="title">
                <span>{{ $t('editor.readingMode') }}</span>
              </template>
              <a-icon type="read"/>
            </a-tooltip>
          </li>
        </ul>
      </div>
      <div class="editor-inner" v-show="editingFile !== null">
        <coder :style="coderStyle" :scrollTopPercent.sync="scrollTopPercent"/>
        <mark-displayer :style="markDisplayerStyle" :scrollTopPercent="scrollTopPercent"/>
      </div>
      <div class="editor-inner no-opened-doc" v-show="editingFile === null">
        <a-button type="primary" size="large">
          {{ $t('navigator.openFile') }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import Coder from "./Coder";
import MarkDisplayer from "./MarkDiaplayer";
import FileBar from "./FileBar";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapMutations } = createNamespacedHelpers("File");
const { ipcRenderer } = require("electron");
export default {
  name: "editor",
  components: {
    [Coder.name]: Coder,
    [MarkDisplayer.name]: MarkDisplayer,
    [FileBar.name]: FileBar
  },
  data() {
    return {
      mode: "classic", // 默认为经典模式,
      scrollTopPercent: 0,
      hideFileBar: false // 是否折叠 FileBar
    };
  },
  computed: {
    ...mapGetters(["editingFile"]),
    coderStyle() {
      let o = {};
      switch (this.mode) {
        case "edit":
          o["width"] = "100%";
          break;
        case "classic":
          o["width"] = "50%";
          break;
        case "reading":
          o["display"] = "none";
          break;
      }
      return o;
    },
    markDisplayerStyle() {
      let o = {};
      switch (this.mode) {
        case "edit":
          o["display"] = "none";
          break;
        case "classic":
          o["width"] = "50%";
          break;
        case "reading":
          o["width"] = "100%";
          break;
      }
      return o;
    }
  },
  methods: {
    ...mapMutations(["addFile", "setCurrentFile", "saveFile"]),
    changeMode(mode) {
      this.mode = mode;
    },
    onFoldPanel() {
      console.log("change");
      this.hideFileBar = !this.hideFileBar;
    },
    onSave() {
      if (!this.editingFile) return;
      if (this.editingFile.saveAfterModified) return;
      const file = this.editingFile;
      this.saveDocument(file);
    },
    onExport() {
      if (!this.editingFile) return;
      let file = this.editingFile;
      ipcRenderer.send("requestPath", {
        title: "选择需要保存的位置",
        defaultPath: file.name,
        type: "saveFile"
      });
    },
    saveDocument(file) {
      ipcRenderer.send("saveFile", file);
      ipcRenderer.on("write-done", (e, isSuccess, err) => {
        if (isSuccess) {
          // todo i18n格式化参数有问题
          // ! 原因未知
          this.addFile(file);
          this.setCurrentFile(file.path);
          this.saveFile(file.path);
          this.$notification.success({
            message: this.$t("editor.saveFile.success", {
              name: file.name
            }),
            description: this.$t("editor.saveFile.successReason", {
              name: file.name,
              path: file.path
            }),
            duration: 2
          });
        } else {
          this.$notification.error({
            message: this.$t("editor.saveFile.fail", { name: file.name }),
            description: this.$t("editor.saveFile.failReason", {
              error: err
            }),
            duration: 2
          });
        }
      });
    }
  },
  created() {
    let file = this.editingFile;
    ipcRenderer.on("responsePath", (e, path) => {
      // 从 path 中获取文件名
      if (!path) return;
      const _path = path.split("\\");
      const filename = _path[_path.length - 1];
      const newFile = {
        ...file,
        name: filename,
        path
      };
      this.saveDocument(newFile);
    });
  }
};
</script>

<style lang="scss">
.fold-enter-active,
.fold-leave-active {
  transition: all 0.2s linear;
  z-index: 0;
}

.fold-enter-to,
.fold-leave {
  transform: translateX(0);
}

.fold-enter,
.fold-leave-to {
  transform: translateX(-240px);
}

.editor {
  position: relative;

  .editor-wrapper {
    position: absolute;
    top: 0;
    left: 240px;
    right: 0;
    height: 100%;
    transition: left 0.2s linear;

    &.expand {
      left: 0;
    }
  }

  .editor-header {
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: #fff;
    border-bottom: 1px solid #f1f1f1;
    z-index: 10;
    -webkit-app-region: drag;

    .editor-header-button-group {
      list-style: none;
      display: inline-block;
      margin: 0;
      padding: 0;
      height: 100%;
      -webkit-app-region: no-drag;

      .editor-header-button {
        float: left;
        padding: 0 5px;
        margin: 10px;
        line-height: 30px;
        font-size: 24px;

        &:hover {
          color: #94a9d5;
          cursor: pointer;
        }

        &.current {
          color: #94a9d5;
        }

        .anticon {
          transition: all 0.2s linear;

          &.expand {
            transform: rotate(180deg);
          }
        }
      }
    }
  }

  .filebar {
    float: left;
  }

  .editor-inner {
    padding-top: 50px;
    margin-left: 0;
    display: flex;
    height: 100%;
    position: relative;

    &.no-opened-doc {
      justify-content: center;
      align-items: center;
    }

    .loading-block {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      z-index: 10;
    }
  }
}
</style>


