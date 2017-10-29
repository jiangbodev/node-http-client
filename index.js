const request = require('superagent');
require('superagent-charset')(request) // install charset

const httpClient = {

  callbacks: [],

  registerCallback: function (fn) {
    if (fn) {
      this.callbacks.push(fn);
    }
  },

  get: async function (url, charset = '', timeout = { response: 5000, deadline: 10000 }) {
    let res;
    try {
      res = await request.get(url).timeout(timeout).charset(charset).buffer();
    }
    catch (e) { }
    let content = null;
    let ok = false;
    if (res && res.status == 200) {
      content = res.text;
      ok = true;
    }
    try {
      callbacks.forEach(cb => {
        cb({ url, ok, content });
      });
    }
    catch (e) { }
    return content;
  }

}

module.exports = httpClient;
