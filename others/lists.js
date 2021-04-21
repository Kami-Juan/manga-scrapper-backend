const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto('https://lectortmo.com/login');

  await page.type('#email', '');
  await page.type('#password', '');

  await Promise.all([page.waitForNavigation(), page.click('[type=submit]')]);
  await Promise.all([
    page.waitForNavigation(),
    page.goto('https://lectortmo.com/profile/lists'),
  ]);

  const lists = await page.evaluate(() => {
    const mangaLists = Array.from(
      document.querySelectorAll('.col-12.col-sm-12.col-md-6.mt-2>a')
    );

    const listsData = [];

    for (const mangaList of mangaLists) {
      const container = mangaList.querySelector('div');

      const title = container.querySelector('.thumbnail-title').textContent;
      const description = container.querySelector('.thumbnail-description')
        .textContent;
      const type = container.querySelector('.badge').textContent;
      const followers_count = container.querySelector('.followers_count')
        .textContent;

      const url = mangaList.href;

      const mangaImageURL = getComputedStyle(container, '::before')
        .backgroundImage.replace('url("', '')
        .replace('")', '');

      listsData.push({
        url,
        title,
        description,
        type,
        followers_count,
        mangaImageURL,
      });
    }

    return listsData;
  });

  for (const list of lists) {
    await Promise.all([page.goto(list.url), page.waitForNavigation()]);

    const mangas = await page.evaluate(() => {
      const allMangas = Array.from(
        document.querySelectorAll('.element.col-6>a')
      );

      const mangaList = [];

      for (const mangaContainer of allMangas) {
        const mangaURL = mangaContainer.href;
        const mangaImageURL = getComputedStyle(
          mangaContainer.querySelector('div'),
          '::before'
        ).backgroundImage;
        const title = mangaContainer.querySelector('div>.thumbnail-title')
          .textContent;
        const score = mangaContainer.querySelector('div>.score').textContent;
        const bookType = mangaContainer.querySelector('div>.book-type')
          .textContent;
        const demografy = mangaContainer.querySelector('div>.demography')
          .textContent;

        mangaList.push({
          mangaURL,
          mangaImageURL,
          title,
          score,
          bookType,
          demografy,
        });
      }

      return mangaList;
    });

    console.log(mangas);
  }

  // console.log(lists);

  await page.close();
  await browser.close();
})();
