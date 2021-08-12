import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { VideoPlayerItem } from './video-player-item.interface';

@Component({
  selector: 'page-video-player',
  templateUrl: 'video-player.html',
})
export class VideoPlayerPage {

  /**
   * The video player element
   */
  @ViewChild('videoPlayer') videoPlayer: ElementRef;

  /**
   * The current playing item
   */
  current: VideoPlayerItem = null;

  /**
   * The index of the current playing item
   */
  currentIndex: number = 0;

  /**
   * Is the video playing?
   */
  isPlaying = true;

  /**
   * The item to be played
   */
  items: Array<VideoPlayerItem> = [];

  /**
   * The callback triggered when the video ended.
   */
  private videoEndedCallback: any = null;

  constructor(
    private navController: NavController,
    private navParams: NavParams
  ) {
  }

  /**
   * Ionic view lifecycle
   *
   * @return void
   */
  ionViewWillEnter() {
    this.items = this.navParams.get('items');
    this.current = this.items.find((item) => item.playFirst);
    this.currentIndex = this.items.findIndex((item) => item.playFirst);
  }

  /**
   * Ionic view lifecycle
   *
   * @return void
   */
  ionViewDidEnter() {
    this.videoEndedCallback = () => this.videoDidEnd();
    this.videoPlayer.nativeElement.addEventListener('ended', this.videoEndedCallback, false);
  }

  /**
   * Ionic view lifecycle
   *
   * @return void
   */
  ionViewWillLeave() {
    if (this.videoEndedCallback) {
      this.videoPlayer.nativeElement.removeEventListener('ended', this.videoEndedCallback);
      this.videoEndedCallback = null;
    }
  }

  /**
   * Go back to the previous view.
   *
   * @return void
   */
  goBack() {
    this.navController.pop();
  }

  /**
   * Is this the first item in the list?
   *
   * @return yes|no
   */
  isFirstItem(): boolean {
    return (this.currentIndex === 0);
  }

  /**
   * Is this the last item in the list?
   *
   * @return yes|no
   */
  isLastItem(): boolean {
    return ((this.currentIndex + 1) === this.items.length);
  }

  /**
   * Play the next episode
   *
   * @return void
   */
  nextEpisode() {
    if (this.isLastItem()) {
      return;
    }
    this.isPlaying = true;
    this.currentIndex = (this.currentIndex + 1);
    this.current = this.items[this.currentIndex];
  }

  /**
   * Pause the video
   *
   * @return void
   */
  pause() {
    this.isPlaying = false;
    this.videoPlayer.nativeElement.pause();
  }

  /**
   * Play the video
   *
   * @return void
   */
  play() {
    this.isPlaying = true;
    this.videoPlayer.nativeElement.play();
  }

  /**
   * Play the previous video.
   *
   * @return void
   */
  previousEpisode() {
    if (this.isFirstItem()) {
      return;
    }
    this.isPlaying = true;
    this.currentIndex = (this.currentIndex - 1);
    this.current = this.items[this.currentIndex];
  }

  /**
   * The video did end.
   *
   * @return void
   */
  videoDidEnd() {
    this.isPlaying = false;
    if ((this.currentIndex + 1) < this.items.length) {
        setTimeout(() => {
          this.nextEpisode();
        }, 2000);
    }
  }

}
