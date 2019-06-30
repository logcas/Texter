import marked from 'marked';
import markedOptions from '../config/marked';

marked.setOptions(markedOptions);

self.addEventListener('message', (evt) => {
  const code = evt.data;
  self.postMessage(marked(code));
});