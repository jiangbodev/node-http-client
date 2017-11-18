const request = require('superagent');
require('superagent-charset')(request) // install charset

const httpClient = {

  callbacks: [],
  errorLogEnabled: true,
  timeout: {
    response: 10000, 
    deadline: 20000 
  },

  setTimeout(tm) {
    this.timeout = tm;
  },

  enableErrorLog: function() {
    this.errorLogEnabled = true;
  },

  disableErrorLog: function() {
    this.errorLogEnabled = false;
  },

  registerCallback: function (fn) {
    if (fn) {
      this.callbacks.push(fn);
    }
  },

  get: async function (url, charset = '', timeout) {

    let theTimeout = timeout;
    if (!theTimeout) {
      theTimeout = this.timeout;
    }
    let res;
    try {
      res = await request.get(url).timeout(theTimeout).charset(charset).buffer();
    }
    catch (e) {
      if (this.errorLogEnabled) {
        console.error(`http get ${url} failed`, e);
      }
    }
    let content = null;
    let ok = false;
    if (res && res.status == 200) {
      content = res.text;
      ok = true;
    }
    try {
      this.callbacks.forEach(cb => {
        cb({ url, ok, content });
      });
    }
    catch (e) { }
    return content;
  }

}

module.exports = httpClient;
