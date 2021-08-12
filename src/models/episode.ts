import { environment } from '@env';

/**
 * A model for a single episode
 */
export class Episode {

  /**
   * Build the class
   *
   * @param desc          The description
   * @param fileName      The file name
   * @param image         The image file name
   * @param mediaType     The type of media
   * @param title         The title
   * @param language='en' The language
   */
  constructor(
    public desc: string,
    public fileName: string,
    public image: string,
    public mediaType: string,
    public order: number,
    public title: string,
    public language = 'en'
  ) {}

  /**
   * Get the path for the file
   *
   * @return The file path
   */
  get filePath(): string {
    return `${environment.assetPath.replace('{LANG}', this.language)}media/${this.fileName}`;
  }

  /**
   * Get the path for the image
   *
   * @return The image path
   */
  get imagePath(): string {
    return `${environment.assetPath.replace('{LANG}', this.language)}images/${this.image}`;
  }

}
