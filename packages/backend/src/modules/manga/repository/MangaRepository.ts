import Prisma, { PrismaClient, Prisma as PrismaClt } from '@prisma/client';

interface IMangaRepository {
  getManga(idManga: string): Promise<Prisma.Manga>;
  storeManga(manga: Prisma.Manga, list: Prisma.List): Promise<Prisma.Manga>
  updateMangaDetails(manga: Prisma.Manga): Promise<Prisma.Manga>;
}

export class MangaRepository implements IMangaRepository {
  constructor(private ctx: PrismaClient) {}

  getManga(idManga: string): Promise<Prisma.Manga> {
    return this.ctx.manga.findUnique({ where: { id: idManga } });
  }

  storeManga(manga: Prisma.Manga, list: Prisma.List): Promise<Prisma.Manga> {
    return this.ctx.manga.create({
      data: {
        booktype: manga.booktype,
        demography: manga.demography,
        title: manga.title,
        description: manga.description,
        status: manga.status,
        other_titles: manga.other_titles,
        image_url: manga.image_url,
        score: manga.score,
        url: manga.url,
        nfsw: manga.nfsw,
        List: {
          connect: {
            id: list.id
          }
        }
      }
    })
  }

  updateMangaDetails(manga: Prisma.Manga): Promise<Prisma.Manga> {
    return this.ctx.manga.update({
      data: {
        description: manga.description,
        other_titles: manga.other_titles,
        status: manga.status,
        years: manga.years,
      },
      where: {
        id: manga.id,
      },
    });
  }
}
