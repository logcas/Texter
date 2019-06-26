<template>
  <div
    class="filebar-item"
    :class="{
    'current': currentFile === file.path
  }"
    @click="onSelectFile(file.path)"
    :title="file.name"
  >
    <a-icon type="file-markdown" class="file-icon"/>
    <span class="file-modified-time">06-14</span>
    <span>{{ file.name }}</span>
    <div class="file-save-mark" v-show="!file.saveAfterModified"></div>
    <a-icon type="close-circle" class="close-btn" @click.native="onClose"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions } = createNamespacedHelpers("File");
export default {
  name: "filebar-item",
  props: {
    file: Object
  },
  computed: {
    ...mapGetters(["currentFile"])
  },
  methods: {
    ...mapActions(["setCurrentFile", "removeFile", "modifyFile", "saveFile", "changeFile"]),
    onSelectFile(path) {
      this.changeFile();
      this.setCurrentFile(path);
    },
    onClose() {
      let file = this.file;
      if (!file.saveAfterModified) {
        this.$confirm({
          title: this.$t("system.warning"),
          content: this.$t("system.closeDirectlyWarning"),
          okText: this.$t("system.closeDirectly"),
          okType: "danger",
          cancelText: this.$t("system.cancel"),
          onOk: () => {
            this.removeFile(this.file.path);
          },
          onCancel() {}
        });
      } else {
        this.removeFile(this.file.path);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.filebar-item {
  position: relative;
  height: 50px;
  padding: 0 60px 0 50px;
  user-select: none;
  line-height: 50px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: default;

  &:hover,
  &.current {
    background: #f2f2f2;
  }

  &:hover {
    .file-modified-time {
      display: none;
    }

    .close-btn {
      display: block;
      &:hover {
        opacity: 0.7;
        cursor: pointer;
      }
    }
  }

  .file-icon {
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    font-size: 20px;
  }

  .file-modified-time {
    display: block;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  .file-save-mark {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #5576bd;
  }

  .close-btn {
    display: none;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }
}
</style>

