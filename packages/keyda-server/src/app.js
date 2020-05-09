process.env.NODE_ENV =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.trim().toLowerCase() == 'production'
    ? 'production'
    : 'development';
const express = require('express');

const app = express();

app.set('port', process.env.PORT || 5000);
app.set('env', process.env.NODE_ENV || 'development');

module.exports = app;
