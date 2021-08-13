import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { take } from 'rxjs/operators/take';
import { AvPlayerDataStoreProvider } from '@providers/av-player-data-store/av-player-data-store';
import { AvPlayerItem } from '@providers/av-player-data-store/av-player-item.interface';

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
     * Is the item playing?
     */
    isPlaying = true;

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
      private dataStore: AvPlayerDataStoreProvider,
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
      const items = this.navParams.get('items');
      this.dataStore.init(items).pipe(take(1)).subscribe((current: AvPlayerItem) => {
        if (!current) {
          this.goBack();
        } else {
          this.current = current;
        }
      });
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
      this.dataStore.clear();
      this.navController.pop();
    }

    /**
     * Is this the first item in the list?
     *
     * @return yes|no
     */
    isFirstItem(): boolean {
      return this.dataStore.onFirstItem();
    }

    /**
     * Is this the last item in the list?
     *
     * @return yes|no
     */
    isLastItem(): boolean {
      return this.dataStore.onLastItem();
    }

    /**
     * Play the next episode
     *
     * @return void
     */
    nextEpisode() {
      this.dataStore.next().pipe(take(1)).subscribe((next: AvPlayerItem) => {
        if (next == null) {
          this.goBack();
        } else {
          this.current = next;
        }
      });
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
      this.dataStore.previous().pipe(take(1)).subscribe((prev: AvPlayerItem) => {
        if (prev == null) {
          this.goBack();
        } else {
          this.current = prev;
        }
      });
    }

    /**
     * The video did end.
     *
     * @return void
     */
    videoDidEnd() {
      this.isPlaying = false;
      if (this.dataStore.hasMore()) {
          setTimeout(() => {
            this.nextEpisode();
          }, 2000);
      }
    }

}
