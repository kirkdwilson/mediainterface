import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AvPlayerItem } from './av-player-item.interface';

/**
 * An audio and video player.
 */
@IonicPage()
@Component({
  selector: 'page-av-player',
  templateUrl: 'av-player.html',
})
export class AvPlayerPage {

    /**
     * The video player element
     */
    @ViewChild('audioPlayer') audioPlayer: ElementRef;

    /**
     * The video player element
     */
    @ViewChild('videoPlayer') videoPlayer: ElementRef;

    /**
     * The current playing item
     */
    current: AvPlayerItem = null;

    /**
     * The index of the current playing item
     */
    currentIndex: number = 0;

    /**
     * Is the item playing?
     */
    isPlaying = true;

    /**
     * The item to be played
     */
    items: Array<AvPlayerItem> = [];

    /**
     * The callback triggered when the audio/video ended.
     */
    private mediaEndedCallback: any = null;

    /**
     * The callback triggered when the audio/video is paused.
     */
    private mediaPauseCallback: any = null;

    /**
     * The callback triggered when the audio/video is started.
     */
    private mediaPlayCallback: any = null;

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
      this.mediaEndedCallback = () => this.videoDidEnd();
      this.mediaPauseCallback = () => this.isPlaying = false;
      this.mediaPlayCallback = () => this.isPlaying = true;
      this.videoPlayer.nativeElement.addEventListener('play', this.mediaPlayCallback, false);
      this.audioPlayer.nativeElement.addEventListener('play', this.mediaPlayCallback, false);
      this.videoPlayer.nativeElement.addEventListener('pause', this.mediaPauseCallback, false);
      this.audioPlayer.nativeElement.addEventListener('pause', this.mediaPauseCallback, false);
      this.videoPlayer.nativeElement.addEventListener('ended', this.mediaEndedCallback, false);
      this.audioPlayer.nativeElement.addEventListener('ended', this.mediaEndedCallback, false);
    }

    /**
     * Ionic view lifecycle
     *
     * @return void
     */
    ionViewWillLeave() {
      if (this.mediaEndedCallback) {
        this.videoPlayer.nativeElement.removeEventListener('ended', this.mediaEndedCallback);
        this.audioPlayer.nativeElement.removeEventListener('ended', this.mediaEndedCallback);
        this.mediaEndedCallback = null;
      }
      if (this.mediaPauseCallback) {
        this.videoPlayer.nativeElement.removeEventListener('pause', this.mediaPauseCallback);
        this.audioPlayer.nativeElement.removeEventListener('pause', this.mediaPauseCallback);
        this.mediaPauseCallback = null;
      }
      if (this.mediaPlayCallback) {
        this.videoPlayer.nativeElement.removeEventListener('play', this.mediaPlayCallback);
        this.audioPlayer.nativeElement.removeEventListener('play', this.mediaPlayCallback);
        this.mediaPlayCallback = null;
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
      if (this.current.type === 'video') {
        this.videoPlayer.nativeElement.pause();
      } else {
        this.audioPlayer.nativeElement.pause();
      }
    }

    /**
     * Play the video
     *
     * @return void
     */
    play() {
      this.isPlaying = true;
      if (this.current.type === 'video') {
        this.videoPlayer.nativeElement.play();
      } else {
        this.audioPlayer.nativeElement.play();
      }
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
