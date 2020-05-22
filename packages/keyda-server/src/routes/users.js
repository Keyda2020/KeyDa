const express = require('express');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const config = require('../config');
const { writeToStream } = require('fast-csv');
const {
  getDomainFromUrl,
  checkDir,
  initializeCSV,
  fixDataToRow,
} = require('../utils/JSUtility');
const options = {
  mode: 'text',
  pythonPath: '',
  pythonOptions: ['-u'],
  scriptPath: '',
  args: [],
};

const router = express.Router();

const MAX_TRAIN_COUNT = 5;
const MODEL_PATH = `${config.SRC_PATH}/models/temp.py`;
const DB_PATH = `${config.SRC_PATH}/db/`;

router.post('/register', async (req, res) => {
  const keyTimeList = req.body.keyTimeList;
  const userId = req.body.userId;
  const trainCount = req.body.trainCount;
  const reqOrigin = req.headers.origin;

  if (keyTimeList === [] || userId === '') {
    return res.status(202).send({
      success: false,
      error: true,
      count: trainCount,
      message: 'You missed some input, try again.',
    });
  }

  const ORIGIN_DIR_PATH = DB_PATH + getDomainFromUrl(reqOrigin);
  const USER_DATA_PATH = `${ORIGIN_DIR_PATH}/${userId}.csv`;
  const isFirstRequest = trainCount == 0;
  const isTypingTrainData = trainCount < MAX_TRAIN_COUNT - 1;

  if (isFirstRequest) {
    // at first request, check there is dir and csv file, if not, make new one.
    checkDir(ORIGIN_DIR_PATH, (err, isTrue) => {
      if (err) return console.log(err);
      if (!isTrue) {
        console.log('There is a directory already that has a same name');
      } else {
        fs.mkdir(ORIGIN_DIR_PATH, (err) => {
          if (err) console.log(err);
          console.log('Directory generated successfully.');
        });
      }
    });

    const dataFrame = initializeCSV(keyTimeList.length);
    dataFrame.push(keyTimeList);
    const isFileExist = fs.exists(USER_DATA_PATH, (exist) =>
      console.log(
        exist
          ? 'The file is already exists.'
          : 'New user data file is created.',
      ),
    );

    if (!isFileExist) {
      const stream = fs.createWriteStream(USER_DATA_PATH);
      writeToStream(stream, dataFrame, {
        headers: true,
        includeEndRowDelimiter: true,
      });
    }

    return res.status(202).send({
      success: true,
      error: false,
      count: trainCount + 1,
    });
  } else if (isTypingTrainData) {
    let columnLength = 0; // Read current size of the Data.
    let rowLength = 0;
    fs.readFile(USER_DATA_PATH, 'utf8', function (err, data) {
      if (err) console.log(err);
      const allRows = data.split(/\r?\n/);
      rowLength = allRows.length - 1;
      const row = allRows[0].split(',');
      columnLength = row.length;
    });

    const isUnfitData = keyTimeList.length < columnLength;
    if (isUnfitData) {
      return res.status(202).send({
        success: false,
        error: true,
        count: trainCount,
        message: 'You are typed wrong, try again.',
      });
    }

    const rows = fixDataToRow(keyTimeList);
    const stream = fs.createWriteStream(USER_DATA_PATH, { flags: 'a' });
    writeToStream(stream, rows, {
      includeEndRowDelimiter: true,
      writeHeaders: false,
    });

    return res.status(202).send({
      success: true,
      error: false,
      count: trainCount + 1,
    });
  } else {
    // generate a csv file named userId at the directory
    // return and send with status
    return res.status(200).send({
      success: true,
      error: false,
      count: trainCount + 1,
      message: 'train completed',
    });
  }
});

router.post('/login', (req, res) => {
  console.log(req);
  // const resultFromModel = await new Promise((resolve, reject) => {
  //   PythonShell.run(MODEL_PATH, null, (err, results) => {
  //     if (err) return reject(err);
  //     return resolve(results);
  //   });
  // });
  return res.status(200).send({
    success: true,
  });
});

router.post('/change_pw', (req, res) => {
  console.log(req);
  return res.status(200).send({
    success: true,
  });
});

module.exports = router;
