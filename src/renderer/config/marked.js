import hljs from 'highlight.js';
import marked from 'marked';
const renderer = new marked.Renderer();

let rendererCodeFn = renderer.code;
renderer.code = function(code, infostring, escaped) {
  switch(infostring) {
    case 'flow':
    case 'seq':
    case 'gantt':
        return `<div class="mermaid">${code}</div>`;
    default:
      return rendererCodeFn.call(this, code, infostring, escaped);
  }
};

export default {
  renderer,
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