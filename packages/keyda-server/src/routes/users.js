const express = require('express');
const { PythonShell } = require('python-shell');
const config = require('../config');
const options = {
  mode: 'text',
  pythonPath: '',
  pythonOptions: ['-u'],
  scriptPath: '',
  args: [],
};

const router = express.Router();

router.post('/register', async (req, res) => {
  const keyTimeList = req.body.keyTimeList;
  const userId = req.body.userId;

  if (keyTimeList === [] || userId === '') {
    return res.status(204).send({
      success: false,
      error: true,
      message: 'You missed some input, so you can`t register.',
    });
  }

  const reqOrigin = req.headers.origin;
  const data = req.body;

  const resultFromModel = await new Promise((resolve, reject) => {
    const shell = PythonShell.run(config.MODEL_PATH, null, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });

  return res.status(200).send({
    success: true,
    error: false,
    message: 'good',
    pyData: resultFromModel,
  });
});

router.post('/login', (req, res) => {
  console.log(req);
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
