<template>
  <div class="mark-displayer markdown-body" v-html="htmlCode" ref="markdownBody"></div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("File");
import "../../assets/github-markdown.css";
const hljs = require("highlight.js"); // https://highlightjs.org/
const markdown = require("markdown-it")({
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }
    return ""; // use external default escaping
  }
});

export default {
  name: "mark-displayer",
  props: {
    scrollTopPercent: Number
  },
  computed: {
    ...mapGetters(["currentCode"]),
    htmlCode() {
      return markdown.render(this.currentCode);
    }
  },
  watch: {
    scrollTopPercent(val) {
      // todo: scrollbar 滑块的长度不一
      let scrollHeight = this.$refs.markdownBody.scrollHeight;
      let scrollTop = this.$refs.markdownBody.scrollTop;
      this.$nextTick(() => {
        this.$refs.markdownBody.scrollTop = scrollHeight * this.scrollTopPercent / 100;
      });
    }
  }
};
</script>

<style lang="scss">
.mark-displayer {
  height: 100%;
  overflow: auto;
}

.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 45px;
}
</style>


