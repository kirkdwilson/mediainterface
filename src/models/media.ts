import { environment } from '@env';
import { Category } from './category';
import { Episode } from './episode';
import { MEDIA_TYPE_ICONS } from '@constants/icons';

/**
 * A model for a piece of Media
 */
export class Media {
  /**
   * A list of episodes
   */
  public episodes: Array<Episode> = [];

  /**
   * Build the class
   *
   * @param categories        An array of categories
   * @param desc              The description
   * @param image             The image file name
   * @param mediaType         The type of media
   * @param slug              A slug to identify the media
   * @param title             The title
   * @param fileName=''       The name of the file
   * @param language='en'     The current language
   * @param mimeType=''       The mime type of the file
   * @param recommended=false Is it recommended?
   * @param tags =[]          An array of tags
   */
  constructor(
    public categories: Array<Category>,
    public desc: string,
    public image: string,
    public mediaType: string,
    public slug: string,
    public title: string,
    public fileName = '',
    public webPath = '',
    public language = 'en',
    public mimeType = '',
    public recommended = false,
    public tags: Array<string> = []
  ) {
    this.mediaType = this.mediaType.toLowerCase();
  }

  /**
   * Get a list of categories separated by a ,
   *
   * @return The list
   * @link https://stackoverflow.com/a/196991/4638563
   */
  get categoryList(): string {
    return this.categories
      .map((category: Category) => {
        return category.name.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      })
      .sort()
      .join(', ');
  }

  /**
   * Get the path for the file
   *
   * @return The file path
   */
  get filePath(): string {
    if (this.fileName === '') {
      return '';
    }
    const dir = (['html'].indexOf(this.mediaType) !== -1) ? 'html' : 'media';
    return `${environment.assetPath.replace('{LANG}', this.language)}${dir}/${this.fileName}`;
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

  /**
   * Add an episode to the media.
   *
   * @param  episode The episode to add
   * @return         void
   */
  addEpisode(episode: Episode) {
    this.episodes.push(episode);
  }

}
