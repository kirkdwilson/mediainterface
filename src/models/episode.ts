import { environment } from '@env';
import { MEDIA_TYPE_ICONS } from '@constants/icons';

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
   * @param mimeType      The mime type of the file
   * @param title         The title
   * @param language='en' The language
   */
  constructor(
    public desc: string,
    public fileName: string,
    public image: string,
    public mediaType: string,
    public mimeType: string,
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
   * Get the icon that represents this media type.
   *
   * @return The HTML for the icon
   */
  get icon(): string {
    if (MEDIA_TYPE_ICONS.hasOwnProperty(this.mediaType)) {
      return MEDIA_TYPE_ICONS[this.mediaType];
    }
    return 'document';
  }

  /**
   * Get the path for the image
   *
   * @return The image path
   */
  get imagePath(): string {
    return `${environment.assetPath.replace('{LANG}', this.language)}images/${this.image}`;
  }

  /**
   * Get the translation key for displaying the media type.
   *
   * @return The key
   */
  get mediaTypeTranslationKey(): string {
    return `MEDIA_TYPE.${this.mediaType.toUpperCase()}`;
  }

}
