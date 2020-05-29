const express = require('express');
const { PythonShell } = require('python-shell');
const fs = require('fs');
const { writeToStream } = require('fast-csv');
const _ = require('lodash');

const config = require('../config');
const {
  getDomainFromUrl,
  initializeCSV,
  fixDataToRow,
} = require('../utils/JSUtility');
const router = express.Router();

const MAX_TRAIN_COUNT = 10;
const MODEL_PATH = `${config.SRC_PATH}/models/gmm.py`;
const DB_PATH = `${config.SRC_PATH}/db/`;

router.post('/register', (req, res) => {
  const keyTimeList = req.body.keyTimeList;
  const userId = req.body.userId;
  const trainCount = req.body.trainCount;
  const reqOrigin = req.headers.origin;

  if (_.isEqual(keyTimeList, []) || userId === '') {
    return res.status(202).send({
      success: false,
      error: true,
      count: trainCount,
      message: 'You missed some input, try again.',
    });
  }

  const ORIGIN_DIR_PATH = DB_PATH + getDomainFromUrl(reqOrigin);
  const USER_DATA_PATH = `${ORIGIN_DIR_PATH}/${userId}.csv`;
  const isFirstRequest = trainCount == 1;
  const isTypingTrainData = trainCount >= 2 && trainCount <= MAX_TRAIN_COUNT;
  const isFinalData = trainCount === MAX_TRAIN_COUNT;

  if (isFirstRequest) {
    // at first request, check there is dir and csv file, if not, make new one.
    fs.mkdirSync(ORIGIN_DIR_PATH, { recursive: true }, (err) => {
      if (err) console.log(err);
      console.log('Directory generated successfully.');
    });

    const dataFrame = initializeCSV(keyTimeList.length);
    dataFrame.push(keyTimeList);
    const isFileExist = fs.existsSync(USER_DATA_PATH, (exist) => exist);

    console.log(isFileExist);

    const fileMessage = isFileExist
      ? "Because the file of user data is already exists, it's initialized again."
      : 'New user data file is created.';

    if (isFileExist) {
      fs.unlinkSync(USER_DATA_PATH);
    }
    const stream = fs.createWriteStream(USER_DATA_PATH);
    writeToStream(stream, dataFrame, {
      headers: true,
      includeEndRowDelimiter: true,
    });

    const responseCount = trainCount + 1;

    req.app.locals[userId] = {
      onTraining: true,
      trainCount: responseCount,
      keyTimeList: keyTimeList,
    };

    return res.status(201).send({
      success: true,
      error: false,
      count: responseCount,
      message: fileMessage,
    });
  } else if (isTypingTrainData) {
    const isUserActive = res.app.locals[userId].onTraining;
    const prevTrainCount = res.app.locals[userId].trainCount;
    const prevKeyTimeList = res.app.locals[userId].keyTimeList;

    const isSameDataLength = keyTimeList.length === prevKeyTimeList.length;
    const isUserOnRightStep = isUserActive && prevTrainCount === trainCount;

    if (!isSameDataLength) {
      return res.status(202).send({
        success: false,
        error: true,
        count: trainCount,
        message: 'You are typed wrong, please try again.',
      });
    }

    if (!isUserOnRightStep) {
      return res.status(202).send({
        success: false,
        error: true,
        count: 1,
        message: 'Something went wrong, please start over again.',
      });
    }

    const rows = fixDataToRow(keyTimeList);
    const stream = fs.createWriteStream(USER_DATA_PATH, { flags: 'a' });
    writeToStream(stream, rows, {
      includeEndRowDelimiter: true,
      writeHeaders: false,
    });

    if (isFinalData) {
      return res.status(200).send({
        success: true,
        error: false,
        count: trainCount,
        message: `All of your data is received successfully. You are passed ${MAX_TRAIN_COUNT} step.`,
      });
    }

    const responseCount = trainCount + 1;

    res.app.locals[userId] = {
      onTraining: isUserActive,
      trainCount: responseCount,
      keyTimeList: keyTimeList,
    };

    return res.status(201).send({
      success: true,
      error: false,
      count: responseCount,
      message: `Your data is received successfully. You are now in step ${responseCount} of ${MAX_TRAIN_COUNT}.`,
    });
  }
});

router.post('/login', async (req, res) => {
  const keyTimeList = req.body.keyTimeList;
  const userId = req.body.userId;
  const reqOrigin = req.headers.origin;

  if (_.isEqual(keyTimeList, []) || userId === '') {
    return res.status(202).send({
      success: false,
      error: true,
      message: 'You missed some input, try again.',
    });
  }

  const ORIGIN_DIR_PATH = DB_PATH + getDomainFromUrl(reqOrigin);
  const USER_DATA_PATH = `${ORIGIN_DIR_PATH}/${userId}.csv`;

  const isFileExist = fs.existsSync(USER_DATA_PATH, (exist) => exist);
  if (!isFileExist) {
    return res.status(202).send({
      success: false,
      error: true,
      message:
        "Your data doesn't exist in a server. Please try again from the registration step.",
    });
  }

  console.log(
    fs.readFileSync(USER_DATA_PATH, 'utf-8').split(/\r?\n/)[0].split(','),
  );
  const dataLength = fs
    .readFileSync(USER_DATA_PATH, 'utf-8')
    .split(/\r?\n/)[0]
    .split(',').length;

  const isSameDataLength = keyTimeList.length === dataLength;

  if (!isSameDataLength) {
    return res.status(202).send({
      success: false,
      error: true,
      message: 'You are typed wrong, please try again.',
    });
  }

  const rows = fixDataToRow(keyTimeList);
  const stream = fs.createWriteStream(USER_DATA_PATH, { flags: 'a' });
  writeToStream(stream, rows, {
    includeEndRowDelimiter: true,
    writeHeaders: false,
  });

  const options = {
    mode: 'text',
    pythonPath: '',
    pythonOptions: ['-u'],
    scriptPath: '',
    args: [USER_DATA_PATH], // argv[0] is the path of .py file itself
  };

  const resultFromModel = await new Promise((resolve, reject) => {
    PythonShell.run(MODEL_PATH, options, (err, results) => {
      console.log(results);
      if (err) return reject(err);
      return resolve(results);
    });
  });
  const accuracyResult = parseFloat(resultFromModel[0]);
  if (accuracyResult > 70) {
    return res.status(200).send({
      success: true,
      error: false,
      accuracy: accuracyResult,
      message: 'Your typing pattern is correct',
    });
  } else {
    return res.status(202).send({
      success: false,
      error: true,
      accuracy: accuracyResult,
      message: 'Your typing pattern is not correct',
    });
  }
});

module.exports = router;
