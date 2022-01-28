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
   * The title of the item
   */
  title: string;
}
