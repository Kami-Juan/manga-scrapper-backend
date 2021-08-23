import Prisma, { PrismaClient, Prisma as PrismaClt } from '@prisma/client';
import axios from 'axios';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';

interface IChapterRepository {
  getMangaChapters(url: string): Promise<Prisma.Chapter[]>;
  getChapter(url: string): Promise<string[]>;
  getChapterByManga(idManga: string): Promise<Prisma.Chapter[]>;
  getTotalChaptersByManga(idManga: string): Promise<number>;
  getMangaData(url: string): Promise<Prisma.Manga>;
  storeAllChapters(chapters: Prisma.Chapter[], mangaId: string): Promise<void>;
}

export class ChapterRepository implements IChapterRepository {
  constructor(private ctx: PrismaClient) {}

  async getMangaData(url: string): Promise<Prisma.Manga> {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36')

    await page.goto(url, {
      waitUntil: 'networkidle0'
    });

    const rawLink = await page.evaluate(() => document.documentElement.outerHTML);

    const $ = cheerio.load(rawLink);

    const years = $(
      '.element-header-content-text>.element-title>.text-muted',
    ).text();
    const description = $(
      '.element-header-content-text>.element-description',
    ).text();
    const image = $('.element-header-content>div>div>div>div>.book-thumbnail').attr('src');
    const score = $('.element-header-content>div>div>div>div>.score').text()
    const status = $('.element-header-content-text>.book-status').text();
    const title = $('.element-header-content-text>h2').text();
    const otherTitles: string[] = $(
      '.element-header-content-text>.badge.badge-pill',
    )
      .toArray()
      .reduce((prev, el) => {
        const prevEl = $(el).prev().text();

        if (prevEl === 'Sinónimos') {
          return prev;
        }

        return [...prev, $(el).text()];
      }, []);

    await page.close();
    await browser.close();

    return {
      description: description.trim(),
      status: status.trim(),
      other_titles: otherTitles.join(', '),
      years: years.replace(')', '').replace('(', '').trim(),
      title,
      booktype: '',
      demography: '',
      image_url: image,
      score: new PrismaClt.Decimal(parseFloat(score)),
      url,
      id: '',
      nfsw: false,
    };
  }

  async storeAllChapters(
    chapters: Prisma.Chapter[],
    mangaId: string,
  ): Promise<void> {
    await this.ctx.chapter.createMany({
      data: chapters.map((ch) => ({ ...ch, manga_id: mangaId })),
    });
  }

  getTotalChaptersByManga(idManga: string): Promise<number> {
    return this.ctx.chapter.count({ where: { manga_id: idManga } });
  }

  getChapterByManga(idManga: string): Promise<Prisma.Chapter[]> {
    return this.ctx.chapter.findMany({ where: { manga_id: idManga } });
  }

  async getChapter(url: string): Promise<string[]> {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36')

    await page.goto(url, {
      waitUntil: 'networkidle0'
    });

    const rawLink = await page.evaluate(() => document.documentElement.outerHTML);

    const $ = cheerio.load(rawLink);

    await page.close();
    await browser.close();

    const textTag = $('.d-inline:nth-child(4).px-1>.nav-link').text().trim();

    if (textTag === 'Cascada') {
      const cascadeLink = $('.d-inline:nth-child(4).px-1>.nav-link').attr(
        'href',
      );

      const cascadeBrowser = await puppeteer.launch({
        headless: true,
      });
      const cascadePage = await cascadeBrowser.newPage();
      await cascadePage.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36')

      await cascadePage.goto(cascadeLink, {
        waitUntil: 'networkidle0'
      });

      const cascadeRawLink = await cascadePage.evaluate(() => document.documentElement.outerHTML);

      const $2 = cheerio.load(cascadeRawLink);

      await cascadePage.close();
      await cascadeBrowser.close();

      return $2('#main-container>div>img')
        .toArray()
        .map((el) => el.attribs['data-src']);
    }

    return $('#main-container>div>img')
      .toArray()
      .map((el) => el.attribs['data-src']);
  }

  async getMangaChapters(url: string): Promise<Prisma.Chapter[]> {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36')

    await page.goto(url, {
      waitUntil: 'networkidle0'
    });

    const rawLink = await page.evaluate(() => document.documentElement.outerHTML);

    const $ = cheerio.load(rawLink);

    const lastCaps = $('.chapters>ul>li').toArray();
    const firstsCaps = $('.chapters>ul>#chapters-collapsed>li').toArray();

    const capsData: Prisma.Chapter[] = [...lastCaps, ...firstsCaps].reduce(
      (prev, el) => {
        const title = $('h4', el).text().trim();
        const url = $('div>div>ul>li>.row>div:last-child>a', el).attr('href');
        const fansubTitle = $(
          'div>div>ul>li>.row>div:nth-child(1)>span>a:nth-child(1)',
          el,
        ).text();
        const fansubUrl = $(
          'div>div>ul>li>.row>div:nth-child(1)>span>a:nth-child(1)',
          el,
        ).attr('href');
        const publishDate = $(
          'div>div>ul>li>.row>div:nth-child(2)>span',
          el,
        ).text();

        return [
          ...prev,
          {
            title,
            url,
            fansub_title: fansubTitle.trim(),
            fansub_url: fansubUrl.trim(),
            publish_date: new Date(publishDate.trim().split(' ')[0]),
          },
        ];
      },
      [],
    );

    return capsData;
  }
}
