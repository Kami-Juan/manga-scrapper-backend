import { ListManga } from '../domain/ListManga';

export interface ListMangaRaw {
  url: string;
  title: string;
  description: string;
  visibilily: boolean;
  followers: number;
  image_url: string;
}

export class ListMangaMapper {
  public static toPersistence(list: ListManga): ListMangaRaw {
    return {
      url: list.url,
      title: list.title,
      description: list.description,
      visibilily: list.visibilily,
      followers: list.followers,
      image_url: list.image_url,
    };
  }
}
