<template>
  <ul class="system-button">
    <li @click="minimize"><a-icon type="minus" /></li>
    <li @click="resize"><a-icon type="border" /></li>
    <li class="close" @click="close"><a-icon type="close" /></li>
  </ul>
</template>

<script>
const { ipcRenderer } = require("electron");
export default {
  name: "system-button",
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

<style lang="scss">
.system-button {
  display: block;
  margin: 0;
  padding: 0;
  list-style: none;
  position: fixed;
  top: 0;
  right: 0;
  -webkit-app-region: no-drag;
  font-size: 15px;

  li {
    float: left;
    padding: 5px 10px;

    &:hover {
      background: rgba(0, 0, 0, .1);
      cursor: pointer;
    }

    &.close:hover {
      background: rgba(255, 0, 0, .7);
      color: #fff;
    }
  }
}
</style>
