import prisma from '../../../configuration/prisma';
import { ChapterRepository } from './ChapterRepository';

const chapterRepository = new ChapterRepository(prisma);

export { chapterRepository };
