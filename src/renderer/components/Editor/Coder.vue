<template>
  <div class="coder" style="height: 100%;">
    <codemirror
      :value="currentCode"
      @input="onInput"
      :options="cmOptions"
      style="height: 100%;"
      @scroll="onScroll"
    ></codemirror>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapGetters } = createNamespacedHelpers("File");
import { codemirror } from "vue-codemirror";
import "../../assets/codemirror.css";
import "codemirror/theme/base16-light.css";

export default {
  name: "coder",
  props: {
    scrollTopPercent: Number
  },
  computed: {
    ...mapGetters(["currentCode", "currentFile", "isChangeFile"])
  },
  data() {
    return {
      innerCode: this.code,
      cmOptions: {
        tabSize: 4,
        mode: "text/plain",
        theme: "base16-light",
        lineNumbers: true,
        line: true
      }
    };
  },
  methods: {
    ...mapActions(["setFileContent", "modifyFile"]),
    onInput(val) {
      // ! fix: 改变文件选择时会显示修改过文件
      if(!this.isChangeFile) this.modifyFile();
      this.setFileContent(val);
    },
    onScroll(e) {
      // console.log(e);
      // console.log(e.display.scrollbars.vert.scrollHeight);
      // console.log(e.display.scrollbars.vert.scrollTop);
      let scrollHeight = e.display.scrollbars.vert.scrollHeight;
      let scrollTop = e.display.scrollbars.vert.scrollTop;
      let percent = scrollTop / scrollHeight * 100;
      this.$emit('update:scrollTopPercent', percent);
    }
  },
  components: { codemirror }
};
</script>

<style lang="scss" scoped>
.code {
  >>> .CodeMirror {
    height: 100% !important;
  }
}
</style>

