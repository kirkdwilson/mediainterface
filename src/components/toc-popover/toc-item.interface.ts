/**
 * An interface for items in the table of contents
 */
export interface TocItem {
  /**
   * An id for the item
   */
  id: string;
  /**
   * The label for this nav item
   */
  label: string;
  /**
   * The unique path for the item
   */
  ref: string;
}
