/**
 * An interface for items to be played by the video player
 */
export interface VideoPlayerItem {
  /**
   * Is this the video to play first?
   */
  playFirst: boolean;
  /**
   * The URL for the video file
   */
  url: string;
  /**
   * The url for the poster image
   */
  posterUrl: string;
}
