/**
 * An interface for items provided to the viewer
 */
export interface ViewerItem {
  /**
   * Is the first item that should be viewed?
   */
  isFirst: boolean;
  /**
   * The path to the item
   */
  path: string;
  /**
   * The title of the item
   */
  title: string;
}
