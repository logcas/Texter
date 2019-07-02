import hljs from 'highlight.js';
import marked from 'marked';
import katex from 'katex';
const renderer = new marked.Renderer();

/*
let rendererParagraphFn = renderer.paragraph;
renderer.paragraph = function(text) {
  if(text.startsWith('$$') && text.endsWith('$$')) {
    return katex.renderToString(text.slice(2, -2), { throwOnError: false });
  } else {
    return rendererParagraphFn.call(this, text);
  }
}
*/

let rendererCodeFn = renderer.code;
renderer.code = function(code, infostring, escaped) {
  switch(infostring) {
    case 'flow':
    case 'seq':
    case 'gantt':
        return `<div class="mermaid">${code}</div>`;
    case 'math':
        return katex.renderToString(code, { throwOnError: false });
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