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

      let index = 0;
      for (var element of elements) {
        const title = element.querySelector('h2');
        const obj = {title: title.innerText};

        const images = element.querySelectorAll('a');
        if (images.length > 1) obj.image = images[3].getAttribute('href');

        data.push(obj); // Push an object with the data onto our array
        index + 1;
      }

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
