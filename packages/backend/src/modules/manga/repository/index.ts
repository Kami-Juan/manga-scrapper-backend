import prisma from '../../../configuration/prisma';
import { MangaRepository } from './MangaRepository';

const mangaRepository = new MangaRepository(prisma);

export { mangaRepository };
