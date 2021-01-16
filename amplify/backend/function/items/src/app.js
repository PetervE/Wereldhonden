var express = require('express');
var bodyParser = require('body-parser');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
var axios = require('axios');
var cheerio = require('cheerio');

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
    const url = 'https://wereldhonden.nl/hond-adopteren';
    const operation = await axios.get(url);
    if (operation.data) {
      const $ = cheerio.load(operation.data);
      const raw = $('div[class="items-leading clearfix"]')
        .children('div[itemprop="blogPost"]')
        .html();

      // let list = [];
      // raw.each((i, element) => {
      //   let elem = $(element).html();
      //   list.push(elem);
      // });

      res.json({
        success: 'success',
        url: req.url,
        data: operation.data,
        raw: raw,
        // list: list,
      });
    } else {
      res.json({error: 'no html', url: req.url});
    }
  } catch (err) {
    res.json({error: 'error try catch', url: req.url, data: err});
  }
});

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;
