<template>
  <div class="mark-displayer markdown-body" v-html="htmlCode" ref="markdownBody"></div>
</template>

<script>
// import markedOptions from '../../config/marked';
import MarkedRenderWorker from '../../workers/marked.worker';
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("File");
// const marked = require('marked');
const markedWorker = new MarkedRenderWorker();

export default {
  name: "mark-displayer",
  props: {
    scrollTopPercent: Number
  },
  data() {
    return {
      htmlCode: '',
    }
  },
  computed: {
    ...mapGetters(["currentCode"]),
    /*
    htmlCode() {
      return marked(this.currentCode, markedOptions);
    }
    */
  },
  watch: {
    currentCode(code) {
      markedWorker.postMessage(code);
    },
    scrollTopPercent(val) {
      // todo: scrollbar 滑块的长度不一
      let scrollHeight = this.$refs.markdownBody.scrollHeight;
      let scrollTop = this.$refs.markdownBody.scrollTop;
      this.$nextTick(() => {
        this.$refs.markdownBody.scrollTop = scrollHeight * this.scrollTopPercent / 100;
      });
    }
  },
  created() {
    markedWorker.onmessage = (e) => {
      this.htmlCode = e.data;
    };
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


