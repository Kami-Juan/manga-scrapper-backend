const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('https://lectortmo.com/view_uploads/697295');

  await Promise.all([
    page.click('.d-inline.px-1:nth-child(4)'),
    page.waitForNavigation(),
  ]);

  const mangaImages = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('#main-container>div>img')
    ).map((e) => e.getAttribute('data-src'));
  });

  console.log(mangaImages);

  await page.close();
  await browser.close();
})();
