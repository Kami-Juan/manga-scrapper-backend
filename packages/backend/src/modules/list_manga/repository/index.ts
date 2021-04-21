import prisma from '../../../configuration/prisma';
import { ListMangaRepository } from './ListMangaRepository';

const listMangaRepository = new ListMangaRepository(prisma);

export { listMangaRepository };
