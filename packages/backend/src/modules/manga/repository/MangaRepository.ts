import Prisma, { PrismaClient, Prisma as PrismaClt } from '@prisma/client';

interface IMangaRepository {
  getManga(idManga: string): Promise<Prisma.Manga>;
  updateMangaDetails(manga: Prisma.Manga): Promise<Prisma.Manga>;
}

export class MangaRepository implements IMangaRepository {
  constructor(private ctx: PrismaClient) {}

  getManga(idManga: string): Promise<Prisma.Manga> {
    return this.ctx.manga.findUnique({ where: { id: idManga } });
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
