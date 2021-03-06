const chromium = require('chrome-aws-lambda');

exports.handler = async (event) => {
  let result = null;
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    let page = await browser.newPage();

    await page.goto('https://wereldhonden.nl/hond-adopteren');

    result = await page.evaluate(async () => {
      function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }

      let data = []; // Create an empty array that will store our data
      let elements = document.querySelectorAll('div[itemprop="blogPost"]'); // Select all Products
      const items = Array.from(elements);

      for (var i = 0; i < items.length; i++) {
        const selector = `#divload${i}`;
        const button = `#click${i}`;
        elem = document.querySelector(button);
        if (elem) {
          await elem.click();
          await sleep(500);
        }
      }

      items.map((element, index) => {
        const obj = {};
        let lastProp, isProp;

        // title
        const title = element.querySelector('h2');
        if (!title) return;

        let splits = title.innerText.split('(');
        let length = splits.length;

        obj.titel = splits[0].trim();
        obj.status = length == 2 ? splits[1].trim().slice(0, -1) : false;

        // basic info
        const tds = element.querySelectorAll('td');

        Array.from(tds).map((td, i) => {
          if (!td || !td.innerText) return;
          const text = td.innerText.trim();
          if (text === '&nbsp;' || text === 'Contact opnemen') return;
          if (text && typeof text === 'string' && text.length > 1) {
            isProp = text.substr(text.length - 1) === ':';
            if (isProp) {
              let check = text.slice(0, -1).replace(/ /g, '_').toLowerCase();
              if (!check || check !== undefined) {
                if (check === 'ras/type') lastProp = 'type';
                else {
                  lastProp = check;
                }
              } else {
                lastProp = false;
              }
            } else {
              if (!lastProp) return;
              if (lastProp === 'vergoeding') {
                obj.vergoeding = td.innerText.split(' ')[0];
              } else {
                obj[lastProp] = text;
              }
            }
          }
        });

        // extra text info
        const extra = element.querySelector('div[itemprop="articleBody"]');
        if (extra && extra.innerText && String(extra.innerText).length > 0) {
          let parts = extra.innerText
            .trim()
            .replace(/^( |<br \/>)*(.*?)( |<br \/>)*$/, '$2')
            .split('\n\n');

          parts.map((p, x) => {
            isProp = x % 2 === 0;
            if (isProp) {
              if (x == 0) lastProp = 'verhaal';
              else if (x == 2) lastProp = 'karakter';
              else {
                lastProp = p.slice(0, -1).replace(/ /g, '_').toLowerCase();
              }
            } else {
              obj[lastProp] = p;
            }
          });
        }

        // images
        const imageSelectors = element.querySelectorAll('a');
        let images = [];
        Array.from(imageSelectors).map((img, ind) => {
          let href = img.getAttribute('href');
          if (href && typeof href === 'string' && ind !== 1 && ind !== 2) {
            images.push(href);
          }
        });
        obj.fotos = images;

        // video
        const videoSelectors = element.querySelectorAll('iframe');
        let videos = [];
        Array.from(videoSelectors).map((img, ind) => {
          let videosrc = img.getAttribute('src');
          if (videosrc && typeof videosrc === 'string') {
            videos.push(videosrc.substring(2));
          }
        });
        obj.videos = videos;

        data.push(obj); // Push an object with the data onto our array
      });

      return data; // Return our data array
    });
  } catch (error) {
    console.log(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  const content = result || 'No data';

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(content),
  };
  return response;
};
