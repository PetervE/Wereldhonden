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
      const selector = cheerio.load(operation.data);

      var array = selector('body').find('div[itemprop="blogPost"]');

      let list = [];

      array
        .map((idx, el) => {
          const e = selector(el);
          let obj = {};

          const titleAndStatus = e.find('h2').text().trim();
          const parts = titleAndStatus.split('(');
          const length = parts.length;

          if (length > 1) {
            obj.name = parts[0];
            obj.status = parts[1].slice(0, -1).trim();
          } else {
            obj.name = titleAndStatus;
            obj.status = false;
          }

          const image = e.find('img').attr('src');
          obj.image = image || false;

          var lastKey = false;
          e.find('td').each(function (i, elem) {
            if (i === 0) return;
            const text = selector(this).text();
            if (typeof text !== 'string' || text.length === 0) return;
            const isKey = i % 2 === 0;
            if (isKey) {
              lastKey = text
                .split(':')[0]
                .toLocaleLowerCase()
                .replace(/ /g, '');

              if (lastKey) obj[lastKey] = '';
            } else {
              if (lastKey) obj[lastKey] = text;
            }
          });

          list.push(obj);
        })
        .get();

      res.json({
        success: 'success',
        url: req.url,
        list: list,
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
