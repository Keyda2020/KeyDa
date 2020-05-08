const express = require('express');

const app = express();

app.set('port', process.env.PORT || 5000);
app.set('env', process.env.NODE_ENV || 'production');

module.exports = app;
