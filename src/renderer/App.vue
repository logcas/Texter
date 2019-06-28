<template>
  <div class="main">
    <tap-side style="float: left; width: 80px; z-index: 1;"/>
    <div style="margin-left: 80px; height: 100%;">
      <router-view/>
    </div>
    <main-header style="z-index: 99;"/>
  </div>
</template>

<script>
import TapSide from "./components/TapSide";
import MainHeader from "./components/Header";
import MainFooter from "./components/Footer";
import globalConfig from "@/config";
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters } = createNamespacedHelpers("Config");
const { ipcRenderer } = require("electron");
export default {
  name: "texter",
  components: {
    [TapSide.name]: TapSide,
    [MainHeader.name]: MainHeader,
    [MainFooter.name]: MainFooter
  },
  computed: {
    ...mapGetters("commonConfig")
  },
  watch: {
    commonConfig(o) {
      // do something
      let configType = 'common';
      this.configurate(o, configType);
    }
  },
  data() {
    return {
      mode: "Markdown"
    };
  },
  methods: {
    ...mapActions(["setConfig"]),
    configurate(o, type) {
      for(let key of Reflect.ownKeys(o)) {
        globalConfig[type][key].handler(this, key, o[key], true);
      }
    }
  },
  created() {
    ipcRenderer.on('saveConfigResult', (event, error) => {
      if(error) {
        this.$notification.error({
          message: this.$t('system.saveConfigError'),
          description: error.code
        });
        return;
      }
    });
    ipcRenderer.on("getConfig", (event, error, config) => {
      if (error) {
        this.$notification.error({
          message: this.$t('system.readConfigError'),
          description: error.code
        });
        return;
      }
      console.log(config);
      this.setConfig(config);
      this.configurate(config.common, 'common');
    });
    ipcRenderer.send("loadConfig");
  },
  mounted() {
    document.documentElement.setAttribute('type', 'light');
  }
};
</script>

<style lang="scss">
@import '@/assets/style/themes/theme-light.scss';

.main {
  width: 100%;
  height: 100%;
  background: #eee;

  .body {
    height: calc(100% - 50px - 30px);
  }
}
</style>
