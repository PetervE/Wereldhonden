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

    result = await page.evaluate(() => {
      let data = []; // Create an empty array that will store our data
      let elements = document.querySelectorAll('div[itemprop="blogPost"]'); // Select all Products

      for (var element of elements) {
        const title = element.querySelector('h2').innerText;
        data.push({title}); // Push an object with the data onto our array
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
    body: JSON.stringify(content),
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
