var express = require('express');
var bodyParser = require('body-parser');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/items', function (req, res) {
  const data = [
    {id: 1, name: 'Dog 1'},
    {id: 2, name: 'Dog 2'},
  ];

  res.json({success: 'get call succeed!', url: req.url, data: data});
});

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;
