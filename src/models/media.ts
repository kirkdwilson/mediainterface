import { environment } from '@env';

/**
 * A model for a piece of Media
 */
export class Media {
  constructor(
    public categories: string[],
    public desc: string,
    public image: string,
    public mediaType: string,
    public slug: string,
    public title: string,
    public language = 'en',
    public recommended = false,
    public tags: Array<string> = []
  ) {}

  /**
   * Get the path for the image
   *
   * @return The image path
   */
  get imagePath(): string {
    return `${environment.assetPath.replace('{LANG}', this.language)}images/${this.image}`;
  }

}
