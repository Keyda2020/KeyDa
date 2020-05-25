module.exports = {
  getDomainFromUrl(url) {
    const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/;
    return regex.exec(url)[1];
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
