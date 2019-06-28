<template>
  <div class="feature-button-group">
    <a-button-group>
      <a-button icon="minus" @click="minimize"/>
      <a-button icon="fullscreen" @click="resize"/>
      <a-button icon="close" @click="close"/>
    </a-button-group>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
export default {
  name: "main-header",
  methods: {
    close() {
      ipcRenderer.send("closeWindow");
    },
    minimize() {
      ipcRenderer.send("minimizeWindow");
    },
    resize() {
      ipcRenderer.send("resizeWindow");
    }
  }
};
</script>

<style lang="scss" scoped>
.feature-button-group {
  position: fixed;
  top: 10px;
  right: 10px;
  -webkit-app-region: no-drag;
}
</style>
