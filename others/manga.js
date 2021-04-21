const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('https://lectortmo.com/library/manhwa/47301/secret-class');
  const mangaData = await page.evaluate(() => {
    const lastCaps = Array.from(document.querySelectorAll('.chapters>ul>li'));
    const firstsCaps = Array.from(
      document.querySelectorAll('.chapters>ul>#chapters-collapsed>li')
    );

    const capsData = [];

    for (const cap of [...lastCaps, ...firstsCaps]) {
      const title = cap.querySelector('h4').textContent;
      const link = cap.querySelector('div>div>ul>li>.row>div:last-child>a')
        .href;

      capsData.push({
        title,
        link,
      });
    }

    return capsData;
  });

  console.log(mangaData);

  await page.close();
  await browser.close();
})();
