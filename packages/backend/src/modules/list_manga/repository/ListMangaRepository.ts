import Prisma, { PrismaClient, Prisma as PrismaClt } from '@prisma/client';

import { PuppeteerListManga } from '../../migration/repository/MigrationRepository';
import { ListManga } from '../domain/ListManga';
import { ListMangaMapper } from '../mappers/ListMangaMapper';

interface IListMangaRepository {
  storeAlllListManga(
    userId: string,
    lists: PuppeteerListManga[],
  ): Promise<Prisma.List[]>;
  storeListMangaByWebScrapping(
    userId: string,
    list: PuppeteerListManga,
  ): Promise<Prisma.List>;
  storeListManga(userId: string, list: ListManga): Promise<Prisma.List>;
  getAllListByUser(userId: string): Promise<Prisma.List[]>;
  getMangasByListId(listId: string): Promise<Prisma.Manga[]>;
  getListById(listId: string): Promise<Prisma.List>;

}

export class ListMangaRepository implements IListMangaRepository {
  constructor(private ctx: PrismaClient) {}

  async storeAlllListManga(
    userId: string,
    lists: PuppeteerListManga[],
  ): Promise<Prisma.List[]> {
    const listsMangaDB: Prisma.List[] = [];

    for (const list of lists) {
      const listDB = await this.storeListMangaByWebScrapping(userId, list);

      listsMangaDB.push(listDB);
    }

    return listsMangaDB;
  }

  async storeListMangaByWebScrapping(
    userId: string,
    list: PuppeteerListManga,
  ): Promise<Prisma.List> {
    return this.ctx.list.create({
      data: {
        description: list.description,
        followers: new PrismaClt.Decimal(list.followers),
        title: list.title,
        url: list.url,
        image_url: list.url,
        visibilily: list.visibilily,
        Manga: {
          create: list.Mangas.map((m) => ({
            ...m,
            score: new PrismaClt.Decimal(m.score),
          })),
        },
        User: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        Manga: true,
      },
    });
  }

  getListById(listId: string): Promise<Prisma.List> {
    return this.ctx.list.findFirst({ where: { id: listId } });
  }

  getAllListByUser(userId: string): Promise<Prisma.List[]> {
    return this.ctx.list.findMany({
      where: {
        user_id: userId,
      },
    });
  }

  getMangasByListId(listId: string): Promise<Prisma.Manga[]> {
    return this.ctx.manga.findMany({
      where: {
        List: { every: { id: listId } },
      },
      include: {
        _count: {
          select: {
            Chapter: true,
          },
        },
      },
    });
  }

  storeListManga(userId: string, list: ListManga): Promise<Prisma.List> {
    const listRaw = ListMangaMapper.toPersistence(list);

    return this.ctx.list.create({
      data: {
        description: listRaw.description,
        followers: new PrismaClt.Decimal(0),
        title: listRaw.title,
        url: '',
        image_url: listRaw.image_url,
        visibilily: true,
        User: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        Manga: true,
      },
    });
  }
}
