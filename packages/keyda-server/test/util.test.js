const {
  getDomainFromUrl,
  initializeCSV,
  fixDataToRow,
} = require('../src/utils/JSUtility');

describe('get domain from url', () => {
  it('should return domain text from url string', () => {
    const url = 'https://example.com';
    const domain = 'example.com';
    const got = getDomainFromUrl(url);
    expect(got).toEqual(domain);
  });
});

describe('initialize csv file header', () => {
  it('should return 2D array filled with one 1D array has same length with argument', () => {
    expect(initializeCSV(8).length).toEqual(1);
    expect(initializeCSV(8)[0].length).toEqual(8);
    expect(initializeCSV(5)).toEqual([['1', '2', '3', '4', '5']]);
  });
});

describe('fix data to fit csv row shape', () => {
  it('should return the array filled with one object and its key as a header.', () => {
    const testList = [100, 50, 30, 4000];
    const expected = [{ '1': 100, '2': 50, '3': 30, '4': 4000 }];
    expect(fixDataToRow(testList)).toEqual(expected);
  });
});
