import { ValueObject } from '../../../core/domain/UseCase';
import { Result } from '../../../core/logic/Result';

interface ListMangaProps {
  url: string;
  title: string;
  description: string;
  visibilily: boolean;
  followers: number;
  image_url: string;
}

export class ListManga extends ValueObject<ListMangaProps> {
  get url(): string {
    return this.props.url;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get visibilily(): boolean {
    return this.props.visibilily;
  }

  get followers(): number {
    return this.props.followers;
  }

  get image_url(): string {
    return this.props.image_url;
  }

  private constructor(props: ListMangaProps) {
    super(props);
  }

  public static create(props: ListMangaProps): Result<ListManga> {
    const list = new ListManga({
      ...props,
    });

    return Result.ok<ListManga>(list);
  }
}
