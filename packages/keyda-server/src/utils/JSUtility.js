const fs = require('fs');

module.exports = {
  getDomainFromUrl(url) {
    const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/;
    return regex.exec(url)[1];
  },

  checkDir(path, callback) {
    fs.stat(path, (err, stats) => {
      if (err && err.code === 'ENOENT') return callback(null, true);
      if (err) return callback(err);

      return callback(null, !stats.isDirectory());
    });
  },

  initializeCSV(length) {
    const csv = [];
    const header = [];
    for (let i = 0; i < length; i++) {
      header.push((i + 1).toString());
    }
    csv.push(header);
    return csv;
  },

  fixDataToRow(list) {
    const obj = {};
    list.map((v, i) => {
      obj[i + 1] = v;
    });
    return [obj];
  },
};
