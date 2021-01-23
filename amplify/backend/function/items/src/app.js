var express = require('express');
var bodyParser = require('body-parser');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
var axios = require('axios');

const chromium = require('chrome-aws-lambda');
const cheerio = require('cheerio');

var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/items', async function (req, res) {
  try {
    res.json({success: 'puppeteer success', url: req.url, data: 'lol'});
  } catch (error) {
    res.json({error: 'error', url: req.url, message: JSON.stringify(error)});
  }
});

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;
