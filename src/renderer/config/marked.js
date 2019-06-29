import hljs from 'highlight.js';
import marked from 'marked';
import 'highlight.js/styles/tomorrow.css';

export default {
  renderer: new marked.Renderer(),
  highlight: function(code) {
    return hljs.highlightAuto(code).value;
  },
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
};