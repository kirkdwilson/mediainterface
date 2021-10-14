import { Media } from '@models/media';
/**
 * An interface for the grouped media
 *
 * @link https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
 */
export interface GroupedMedia {
  [index: string]: {
    label: string;
    media: Array<Media>;
  }
}
