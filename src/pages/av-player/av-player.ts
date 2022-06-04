import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { of } from 'rxjs/observable/of';
import { take } from 'rxjs/operators/take';
import { AvPlayerDataStoreProvider } from '@providers/av-player-data-store/av-player-data-store';
import { AvPlayerItem } from '@interfaces/av-player-item.interface';
import { LanguageProvider } from '@providers/language/language';
import { StatReporterProvider } from '@providers/stat-reporter/stat-reporter';
import { pad } from '@helpers/utilities';
import { Language } from '@models/language';

/**
 * An audio and video player.
 */
@IonicPage({
  name: 'av-player',
  segment: 'details/:slug/media-player',
})
@Component({
  selector: 'page-av-player',
  templateUrl: 'av-player.html',
})
export class AvPlayerPage {

    /**
     * The audio player element
     */
    @ViewChild('audioPlayer') audioPlayer: ElementRef;

    /**
     * The audio player poster
     */
    @ViewChild('audioPoster') audioPoster: ElementRef;

    /**
     * The progress bar element
     */
    @ViewChild('progressBar') progressBar: ElementRef;

    /**
     * The video player element
     */
    @ViewChild('videoPlayer') videoPlayer: ElementRef;

    /**
     * The current playing item
     */
    current: AvPlayerItem = null;

    /**
     * Are we in fullscreen?
     */
    isFullscreen = false;

    /**
     * Is the item playing?
     */
    isPlaying = true;

    /**
     * The current progress
     */
    mediaProgress = 0;

    /**
     * Should we show the overlay?
     */
    showOverlay = true;

    /**
     * The total time remaining
     */
    timeRemaining = '00:00:00';

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

    /**
     * The callback triggered when the audio/video is hovered/tapped.
     */
    private mediaEngagedCallback: any = null;

    /**
     * The callback triggered when the audio/video time is updated.
     */
    private mediaTimeUpdateCallback: any = null;

    /**
     * The slug for the previous page
     */
    slug = '';

    constructor(
      private dataStore: AvPlayerDataStoreProvider,
      @Inject(DOCUMENT) private document: any,
      private languageProvider: LanguageProvider,
      private navController: NavController,
      private navParams: NavParams,
      private statReporterProvider: StatReporterProvider,
      private viewController: ViewController,
    ) {
    }

    /**
     * Ionic view lifecycle
     *
     * @return void
     */
    ionViewWillEnter() {
      const items = this.navParams.get('items');
      this.slug = this.navParams.get('slug');
      this.dataStore.init(items).pipe(
        take(1),
        mergeMap((current: AvPlayerItem)  =>  this.reportView(current)),
      ).subscribe((current: AvPlayerItem) => {
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
      this.mediaTimeUpdateCallback = () => this.timeUpdated();
      this.mediaEngagedCallback = (event) => this.displayOverlay(event);
      this.videoPlayer.nativeElement.addEventListener('play', this.mediaPlayCallback, false);
      this.audioPlayer.nativeElement.addEventListener('play', this.mediaPlayCallback, false);
      this.videoPlayer.nativeElement.addEventListener('pause', this.mediaPauseCallback, false);
      this.audioPlayer.nativeElement.addEventListener('pause', this.mediaPauseCallback, false);
      this.videoPlayer.nativeElement.addEventListener('ended', this.mediaEndedCallback, false);
      this.audioPlayer.nativeElement.addEventListener('ended', this.mediaEndedCallback, false);
      this.videoPlayer.nativeElement.addEventListener('timeupdate', this.mediaTimeUpdateCallback, false);
      this.audioPlayer.nativeElement.addEventListener('timeupdate', this.mediaTimeUpdateCallback, false);

      this.videoPlayer.nativeElement.addEventListener('touchstart', this.mediaEngagedCallback, false);
      this.videoPlayer.nativeElement.addEventListener('mouseenter', this.mediaEngagedCallback, false);
      this.audioPoster.nativeElement.addEventListener('touchstart', this.mediaEngagedCallback, false);
      this.audioPoster.nativeElement.addEventListener('mouseenter', this.mediaEngagedCallback, false);
      this.audioPlayer.nativeElement.addEventListener('touchstart', this.mediaEngagedCallback, false);
      this.audioPlayer.nativeElement.addEventListener('mouseenter', this.mediaEngagedCallback, false);
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
      if (this.mediaTimeUpdateCallback) {
        this.videoPlayer.nativeElement.removeEventListener('timeupdate', this.mediaTimeUpdateCallback);
        this.audioPlayer.nativeElement.removeEventListener('timeupdate', this.mediaTimeUpdateCallback);
        this.mediaTimeUpdateCallback = null;
      }
      if (this.mediaEngagedCallback) {
        this.videoPlayer.nativeElement.removeEventListener('touchstart', this.mediaEngagedCallback);
        this.videoPlayer.nativeElement.removeEventListener('mouseenter', this.mediaEngagedCallback);
        this.audioPoster.nativeElement.removeEventListener('touchstart', this.mediaEngagedCallback);
        this.audioPoster.nativeElement.removeEventListener('mouseenter', this.mediaEngagedCallback);
        this.audioPlayer.nativeElement.removeEventListener('touchstart', this.mediaEngagedCallback);
        this.audioPlayer.nativeElement.removeEventListener('mouseenter', this.mediaEngagedCallback);
        this.mediaEngagedCallback = null;
      }
    }

    /**
     * Go back to the previous view.
     *
     * @return void
     */
    goBack() {
      this.dataStore.clear();
      if (this.navController.canGoBack()) {
        this.navController.pop();
      } else if (this.slug !== '') {
        this.navController.push(
          'media-details',
          { slug: this.slug },
          {
            animate: true,
            direction: 'back',
          },
        ).then(() => {
          // Remove us from backstack
          this.navController.remove(this.viewController.index);
          this.navController.insert(0, 'HomePage');
        });
      } else {
        this.navController.goToRoot({
          animate: true,
        });
      }
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
      this.dataStore.next().pipe(
        take(1),
        mergeMap((next: AvPlayerItem)  =>  this.reportView(next)),
      ).subscribe((next: AvPlayerItem) => {
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
      const element = this.currentPlayerElement();
      element.nativeElement.pause();
    }

    /**
     * Play the video
     *
     * @return void
     */
    play() {
      this.isPlaying = true;
      const element = this.currentPlayerElement();
      element.nativeElement.play();
    }

    /**
     * Play the previous video.
     *
     * @return void
     */
    previousEpisode() {
      this.dataStore.previous().pipe(
        take(1),
        mergeMap((prev: AvPlayerItem)  =>  this.reportView(prev)),
      ).subscribe((prev: AvPlayerItem) => {
        if (prev == null) {
          this.goBack();
        } else {
          this.current = prev;
        }
      });
    }

    /**
     * Display the overlay for a set amount of seconds.
     *
     * @param   event   the event that triggered it
     * @return void
     */
    displayOverlay(event) {
      event.preventDefault();
      if (this.showOverlay) {
        return;
      }
      this.showOverlay = true;
      setTimeout(() => this.showOverlay = true, 3000);
    }

    /**
     * Toggle full screen
     *
     * @return void
     */
    toggleFullscreen() {
      const element = this.document.documentElement;
      if (!this.isFullscreen) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          /* Firefox */
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          /* Chrome, Safari and Opera */
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          /* IE/Edge */
          element.msRequestFullscreen();
        }
        this.isFullscreen = true;

        return;
      }

      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
      this.isFullscreen = false;
    }

    /**
     * Skip back 10 seconds
     *
     * @return void
     */
    skipBackTen() {
      const element = this.currentPlayerElement();
      const native = element.nativeElement;
      native.currentTime -= 10;
    }

    /**
     * Skip forward 10 seconds
     *
     * @return void
     */
    skipForwardTen() {
      const element = this.currentPlayerElement();
      const native = element.nativeElement;
      native.currentTime += 10;
    }

    /**
     * Callback fired when the time is updated.
     *
     * @return void
     */
    timeUpdated() {
      const element = this.currentPlayerElement();
      const native = element.nativeElement;
      this.mediaProgress = ((native.currentTime / native.duration) * 100);
      if (isNaN(this.mediaProgress)) {
        return;
      }
      const totalSecondsRemaining = native.duration - native.currentTime;
      const time = new Date(null);
      time.setSeconds(totalSecondsRemaining);
      let hours = null;

      if(totalSecondsRemaining >= 3600) {
        hours = pad(time.getHours().toString(), 2, '0');
      }

      const minutes = pad(time.getMinutes().toString(), 2, '0');
      const seconds = pad(time.getSeconds().toString(), 2, '0');

      this.timeRemaining = `${hours ? hours : '00'}:${minutes}:${seconds}`;
    }

    /**
     * Update the player when the progress bar is moved
     *
     * @param  $event The triggered event
     * @return        void
     */
    updateProgress($event) {
      const element = this.currentPlayerElement();
      const native = element.nativeElement;
      const progress = this.progressBar.nativeElement;
      const pos = ($event.pageX  - (progress.offsetLeft + progress.offsetParent.offsetLeft)) / progress.offsetWidth;
      native.currentTime = pos * native.duration;
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

    /**
     * Get the current player element
     *
     * @return The current element
     */
    private currentPlayerElement(): ElementRef {
      if (this.current.type === 'audio') {
        return this.audioPlayer;
      }

      return this.videoPlayer;
    }

    /**
     * Report the viewing of an item
     *
     * @param  item The item being viewed
     * @return      The item received
     */
    private reportView(item: AvPlayerItem): Observable<AvPlayerItem> {
      if (!item) {
        return of(null);
      }
      return this.languageProvider.getLanguage().pipe(
        mergeMap((lang: Language) =>  this.statReporterProvider.report(item.slug, 'view', lang.twoLetterCode, item.provider, item.type).pipe(map(() =>  item)))
      );
    }

}
