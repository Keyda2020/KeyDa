const fs = require('fs');
const { writeToStream } = require('fast-csv');

const utilityFunctions = {
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

  reSaveUserData(path, data, isExceedMaxRecords) {
    const columnsLength = data[0].split(',').length;
    const dataFrame = utilityFunctions.initializeCSV(columnsLength);
    const recordStartIndex = isExceedMaxRecords ? 1 : 0;
    const recordEndIndex = isExceedMaxRecords
      ? data.length - 1
      : data.length - 2;
    data.forEach((d, i) => {
      if (i > recordStartIndex && i < recordEndIndex) {
        const transformed = d.split(',');
        dataFrame.push(transformed);
      }
    });

    const stream = fs.createWriteStream(path);
    writeToStream(stream, dataFrame, {
      headers: true,
      includeEndRowDelimiter: true,
    });
  },
};

module.exports = utilityFunctions;
