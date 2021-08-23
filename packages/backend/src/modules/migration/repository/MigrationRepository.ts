import { User } from '../../user/domain/User';
import puppeteer from 'puppeteer';
import { MigrationMap } from '../mappers/MigrationMapper';

export interface PuppeteerListManga {
  id?: number;
  url: string;
  title: string;
  description: string;
  visibilily: boolean;
  followers: number;
  image_url: string;
  Mangas?: PuppeteerManga[];
}

export interface PuppeteerManga {
  url: string;
  image_url: string;
  title: string;
  score: number;
  booktype: string;
  demography: string;
}

interface IMigrationRepository {
  getLists(user: User): Promise<PuppeteerListManga[]>;
  getMangasByList(
    user: User,
    mangaLists: PuppeteerListManga[],
  ): Promise<PuppeteerListManga[]>;
}

export class MigrationRepository implements IMigrationRepository {
  async getLists(user: User): Promise<PuppeteerListManga[]> {
    const { email, password } = MigrationMap.toPersistence(user);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto('https://lectortmo.com/login');

    await page.type('#email', email);
    await page.type('#password', password);

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle0',
      }),
      page.click('[type=submit]'),
    ]);
    await Promise.all([
      page.waitForNavigation(),
      page.goto('https://lectortmo.com/profile/lists'),
    ]);

    const listsMangas: PuppeteerListManga[] = await page.evaluate(() => {
      const mangaListContainers = Array.from(
        document.querySelectorAll('.col-12.col-sm-12.col-md-6.mt-2>a'),
      );

      const listsData = [];

      for (const mangasList of mangaListContainers) {
        const container = mangasList.querySelector('div');

        const title = container
          .querySelector('.thumbnail-title')
          .textContent?.trim();
        const description = container.querySelector('.thumbnail-description')
          .textContent;
        const type = container.querySelector('.badge').textContent;
        const followers_count = container.querySelector('.followers_count')
          .textContent;

        const url = (<HTMLAnchorElement>mangasList).href;

        const image_url = getComputedStyle(container, '::before')
          .backgroundImage.replace('url("', '')
          .replace('")', '');

        listsData.push({
          url,
          title,
          description,
          visibilily: type === 'Privada' ? false : true,
          followers: parseFloat(followers_count),
          image_url,
        });
      }

      return listsData;
    });

    await page.close();
    await browser.close();

    return listsMangas;
  }

  async getMangasByList(
    user: User,
    mangaLists: PuppeteerListManga[],
  ): Promise<PuppeteerListManga[]> {
    const { email, password } = MigrationMap.toPersistence(user);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.goto('https://lectortmo.com/login');

    await page.type('#email', email);
    await page.type('#password', password);

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle0',
      }),
      page.click('[type=submit]'),
    ]);

    const mangasPerList: PuppeteerListManga[] = [];

    for (const list of mangaLists) {
      await Promise.all([page.goto(list.url), page.waitForNavigation()]);

      const mangaData: PuppeteerManga[] = await page.evaluate(() => {
        const allMangas = Array.from(
          document.querySelectorAll('.element.col-6>a'),
        );

        const mangaList = [];

        for (const mangaContainer of allMangas) {
          const mangaURL = (<HTMLAnchorElement>mangaContainer).href;
          const image_url = getComputedStyle(
            mangaContainer.querySelector('div'),
            '::before',
          ).backgroundImage;
          const title = mangaContainer
            .querySelector('div>.thumbnail-title')
            .textContent?.trim();
          const score = mangaContainer.querySelector('div>.score').textContent;
          const booktype = mangaContainer.querySelector('div>.book-type')
            .textContent;
          const demography = mangaContainer.querySelector('div>.demography')
            .textContent;

          mangaList.push({
            url: mangaURL,
            image_url: image_url?.replace('url("', '').replace('")', ''),
            title,
            score: parseFloat(score),
            booktype,
            demography,
          });
        }

        return mangaList;
      });

      mangasPerList.push({
        ...list,
        Mangas: mangaData,
      });
    }

    await page.close();
    await browser.close();

    return mangasPerList;
  }
}
