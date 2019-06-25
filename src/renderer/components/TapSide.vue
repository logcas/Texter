<template>
  <div class="tap-side">
    <ul class="tap-nav">
      <li class="tap-nav-item">
        <newfile-modal/>
      </li>
      <li class="tap-nav-item">
        <a-tooltip placement="right">
          <template slot="title">
            <span>{{ $t('navigator.openFile') }}</span>
          </template>
          <a-button
            type="default"
            shape="circle"
            icon="folder-open"
            size="large"
            @click="openFile"
          />
        </a-tooltip>
        <input type="file" id="file-opener" ref="fileOpener" @change="fileSelectChange">
      </li>
    </ul>
    <ul class="tap-nav tap-selector">
      <li class="tap-nav-item" @click="routePage('editor')" :class="{current: pageName === 'editor'}" :title="$t('navigator.document')">
        <a-icon type="highlight"/>
      </li>
      <li class="tap-nav-item" @click="routePage('plugin')" :class="{current: pageName === 'plugin'}" :title="$t('navigator.pluginCenter')">
        <a-icon type="appstore"/>
      </li>
      <li class="tap-nav-item" @click="routePage('setting')" :class="{current: pageName === 'setting'}" :title="$t('navigator.setting')">
        <a-icon type="setting"/>
      </li>
    </ul>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { parseFilenameFromPath } from "../utils";
import NewFile from "./Modals/NewFile";
const { mapActions } = createNamespacedHelpers("File");
const { ipcRenderer } = require("electron");
export default {
  name: "tap-side",
  components: {
    [NewFile.name]: NewFile
  },
  computed: {
    pageName() {
      return this.$route.name;
    }
  },
  methods: {
    ...mapActions(["addFile"]),
    routePage(pagename) {
      this.$router.push({ name: pagename });
    },
    openFile() {
      const fileOpener = this.$refs.fileOpener;
      fileOpener.click();
      // let files = fileOpener.files.click();
      // console.log(files);
    },
    fileSelectChange(e) {
      let files = e.target.files;
      if (files.length !== 0) {
        files = Array.from(files);
        files.forEach(file => {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onerror = () => {
            this.$notification.error({
              message: this.$t("tapSide.fileOpen.fail"),
              description: this.$t("tapSide.fileOpen.failReason", {
                path: file.path
              }),

              duration: 2
            });
          };
          reader.onload = () => {
            let fileObject = {
              path: file.path,
              name: file.name,
              content: reader.result,
              lastModified: file.lastModified,
              type: file.type,
              saveAfterModified: true
            };
            this.addFile(fileObject);
            this.$notification.success({
              message: this.$t("tapSide.fileOpen.success"),
              description: this.$t("tapSide.fileOpen.successReason", {
                path: file.path
              }),
              duration: 2
            });
          };
        });
      }
      e.target.value = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.tap-side {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #5576bd;
  overflow: visible;

  #file-opener {
    display: none;
  }

  .tap-selector {
    box-sizing: border-box;
    position: absolute;
    bottom: 20px;
    width: 100%;

    .tap-nav-item {
      &.current {
        position: relative;
        background: #435d99;
        overflow: hidden;
      }

      &.current::after {
        display: block;
        position: absolute;
        content: " ";
        background: #7ebbed;
        width: 4px;
        height: 100%;
        top: 0;
        box-shadow: 0px 0px 10px 2px #7ebbed;
      }
    }
  }

  .tap-nav {
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;

    .tap-nav-item {
      padding: 5px 0;
      text-align: center;
      font-size: 30px;
      color: rgb(228, 227, 227);

      &:hover {
        color: #74b1be;
        cursor: pointer;
      }
    }
  }
}
</style>

