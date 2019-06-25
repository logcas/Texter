<template>
  <div class="setting">
    <div class="movable-header"/>
    <a-tabs defaultActiveKey="1" style="-webkit-app-region: no-drag;">
      <a-tab-pane :tab="$t('setting.general')" key="1">
        <setting-form :meta="commonSettingMeta" settingType="generalSetting"/>
      </a-tab-pane>
      <a-tab-pane :tab="$t('setting.input')" key="2" forceRender>Commong Soon</a-tab-pane>
      <a-tab-pane :tab="$t('setting.about')" key="3">
        <texter-about/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { common as commonSetting } from "@/config";
import SettingForm from "./SettingForm";
import About from './About';
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("Config");
export default {
  name: "texter-setting",
  components: {
    [SettingForm.name]: SettingForm,
    [About.name]: About
  },
  data() {
    return {
      commonSettingMeta: []
    };
  },
  computed: {
    ...mapGetters(["commonConfig"])
  },
  watch: {
    commonConfig: {
      handler(config) {
        this.commonSettingMeta = this.combineConfigObject(commonSetting, config);
      },
      immediate: true
    }
  },
  methods: {
    combineConfigObject(a, b) {
      let meta = [];
      for (let key of Reflect.ownKeys(a)) {
        if (!key.startsWith("__")) {
          let defaultValue = (b && b[key]) || a[key].defaultValue;
          meta.push({
            name: key,
            ...a[key],
            defaultValue
          });
        }
      }
      return meta;
    },
  }
};
</script>

<style lang="scss" scoped>
.setting {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 20px;

  .movable-header {
    position: absolute;
    top: -20px;
    height: 100px;
    left: 0;
    right: 0;
    -webkit-app-region: drag;
  }
}
</style>

