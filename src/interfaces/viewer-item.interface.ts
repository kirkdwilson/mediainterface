/**
 * An interface for items provided to the viewer
 */
export interface ViewerItem {
  /**
   * Is the first item that should be viewed?
   */
  isFirst: boolean;
  /**
   * The path to download the item
   */
  downloadPath: string;
  /**
   * The path to the item
   */
  filePath: string;
  /**
   * The media provider
   */
  provider: string;
  /**
   * The slug identifier for the item
   */
  slug: string;
  /**
   * The title of the item
   */
  title: string;
  /**
   * The media type of the item
   */
  type: string;
}
