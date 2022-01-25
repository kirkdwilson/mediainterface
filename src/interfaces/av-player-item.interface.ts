/**
 * An interface for items to be played by the audio/video player
 */
export interface AvPlayerItem {
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
  /**
   * The type of item
   */
  type: 'audio' | 'video';
}
