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
import "codemirror/theme/monokai.css";

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
        theme: "monokai",
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

.cm-s-monokai.CodeMirror { background: #282C34; color: #ABB2BF; }
.cm-s-monokai div.CodeMirror-selected { background: #49483E; }
.cm-s-monokai .CodeMirror-line::selection, .cm-s-monokai .CodeMirror-line > span::selection, .cm-s-monokai .CodeMirror-line > span > span::selection { background: rgba(73, 72, 62, .99); }
.cm-s-monokai .CodeMirror-line::-moz-selection, .cm-s-monokai .CodeMirror-line > span::-moz-selection, .cm-s-monokai .CodeMirror-line > span > span::-moz-selection { background: rgba(73, 72, 62, .99); }
.cm-s-monokai .CodeMirror-gutters { background: #282C34; border-right: 0px; }
.cm-s-monokai .CodeMirror-guttermarker { color: #CF666F; }
.cm-s-monokai .CodeMirror-guttermarker-subtle { color: #CF666F; }
.cm-s-monokai .CodeMirror-linenumber { color: #CF666F; }
.cm-s-monokai .CodeMirror-cursor { border-left: 1px solid #f8f8f0; }

</style>

