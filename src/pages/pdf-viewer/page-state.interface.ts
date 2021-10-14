/**
 * Keep track of the page state for the PDF viewer
 */
export interface PageState {
  /**
   * Did the user alter the scale? Bypass auto scale.
   */
  alteredScale: boolean;
  /**
   * The page they are currently viewing
   */
  current: number;
  /**
   * The last loaded page in the view
   */
  lastLoaded: number;
  /**
   * The current scale
   */
  scale: number;
  /**
   * At what rate to you want to scale the page
   */
  scaleRate: number;
  /**
   * The total number of pages in the document
   */
  total: number;
}
