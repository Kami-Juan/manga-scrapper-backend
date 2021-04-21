import { ValueObject } from '../../../core/domain/UseCase';

interface MangaProps {
  url: string;
  title: string;
  score: number;
  booktype: string;
  demography: string;
  image_url: string;
}

export class Manga extends ValueObject<MangaProps> {}
