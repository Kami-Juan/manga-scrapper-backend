import { ValueObject } from '../../../core/domain/UseCase';

interface ListMangaProps {
  url: string;
  title: string;
  description: string;
  visibilily: boolean;
  followers: number;
  image_url: string;
}

export class ListManga extends ValueObject<ListMangaProps> {}
