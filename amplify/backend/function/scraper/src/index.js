const chromium = require('chrome-aws-lambda');

async function waitAndClick(index, page) {
  // await page.waitForFunction(
  //   `document.querySelector('${selector}') && document.querySelector('${selector}').clientHeight != 0`,
  //   {visible: true},
  // );

  const selector = `#divload${index}`;
  const button = `#click${index}`;

  await page.evaluate(
    (button) => document.querySelector(button).click(),
    button,
  );
  await page.waitForFunction(
    `document.querySelector('${selector}') && document.querySelector('${selector}').clientHeight != 0`,
    {visible: true},
  );
}

function isElement(o) {
  return typeof HTMLElement === 'object'
    ? o instanceof HTMLElement //DOM2
    : o &&
        typeof o === 'object' &&
        o !== null &&
        o.nodeType === 1 &&
        typeof o.nodeName === 'string';
}

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

    for (var i = 0; i < 41; i++) {
      await waitAndClick(i, page);
    }

    result = await page.evaluate(() => {
      let data = []; // Create an empty array that will store our data
      let elements = document.querySelectorAll('div[itemprop="blogPost"]'); // Select all Products

      Array.from(elements).map((element, index) => {
        const obj = {};

        // title
        const title = element.querySelector('h2');

        // basic info
        const tds = element.querySelectorAll('td');
        let lastProp;
        Array.from(tds).map((td, i) => {
          if (!td || !td.innerText) return;
          const text = td.innerText.trim();
          if (text && typeof text === 'string' && text.length > 1) {
            const isProp = i % 2 === 0;
            if (isProp) {
              lastProp = text;
              obj[text] = '';
            } else {
              obj[lastProp] = text;
            }
          }
        });

        // extra text info
        const extra = element.querySelector('div[itemprop="articleBody"]');
        let lastExtraProp;
        if (extra.innerText) {
          let parts = extra.innerText
            .trim()
            .replace(/^( |<br \/>)*(.*?)( |<br \/>)*$/, '$2')
            .split('\n\n');

          parts.map((p, x) => {
            const isProp = x % 2 === 1;
            if (isProp) {
              lastExtraProp = p.trim();
            } else {
              obj[lastExtraProp] = p;
            }
          });
        }

        // const imageSelectors = element.querySelectorAll('a');
        // let images = [];
        // for (let image of imageSelectors) {
        //   if (isElement(image)) images.push(image.getAttribute('href'));
        // }
        // obj.images = images;

        if (title) obj.title = title.innerText;
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
    body: content,
  };
  return response;
};

// exports.handler = async (event) => {
//   // TODO implement
//   const response = {
//     statusCode: 200,
//     //  Uncomment below to enable CORS requests
//     //  headers: {
//     //      "Access-Control-Allow-Origin": "*",
//     //      "Access-Control-Allow-Headers": "*"
//     //  },
//     body: JSON.stringify('Hello from Lambda!'),
//   };
//   return response;
// };
