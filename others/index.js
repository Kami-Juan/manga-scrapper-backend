const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto('https://lectortmo.com/login');

  await page.type('#email', '');
  await page.type('#password', '');

  await Promise.all([page.waitForNavigation(), page.click('[type=submit]')]);

  await page.waitForSelector('a#pills-lists-tab');

  const [request] = await Promise.all([
    page.waitForResponse((request) => {
      return request.url().includes('scheduled_lists');
    }),
    page.click('a#pills-lists-tab'),
  ]);

  const manga_list = await request.json();

  await page.waitForFunction(
    () => document.querySelector('#list-input').options.length > 1
  );

  for (const manga of manga_list) {
    await page.select('#list-input', `${manga.id}`);

    await page.waitForFunction(
      (title) => {
        return (
          document.querySelector('#list-elements>h4') &&
          document.querySelector('#list-elements>h4').textContent === title
        );
      },
      {},
      manga.title
    );

    const currentMangaData = await page.evaluate(() => {
      const mangaListContainers = Array.from(
        document.querySelectorAll('#list-elements>div.element')
      );

      const mangaData = [];

      for (const mangaContainer of mangaListContainers) {
        const mangaURL = mangaContainer.querySelector('a').href;
        const mangaImageURL = getComputedStyle(
          mangaContainer.querySelector('a>div'),
          '::before'
        ).backgroundImage;
        const title = mangaContainer.querySelector('a>div>.thumbnail-title')
          .textContent;
        const score = mangaContainer.querySelector('a>div>.score').textContent;
        const bookType = mangaContainer.querySelector('a>div>.book-type')
          .textContent;
        const readMangas = mangaContainer.querySelector(
          'a>div>.thumbnail-footer'
        ).textContent;

        mangaData.push({
          url: mangaURL,
          image: mangaImageURL.replace('url("', '').replace('")', ''),
          title,
          score,
          bookType,
          readMangas,
        });
      }

      return mangaData;
    });
    console.log(currentMangaData);
  }

  await page.close();
  await browser.close();
})();
