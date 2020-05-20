const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  console.log(req.headers.origin);
  console.log(req.body);
  return res.status(200).send({
    success: true,
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
