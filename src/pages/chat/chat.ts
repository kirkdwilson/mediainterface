import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { generateNickname } from '@helpers/utilities';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

/**
 * The Component for the chat page.
 */
@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;

  timeStamp = 0;
  data = { nick:'', message:'', timestamp:0 ,body: ''};
  chats = [];
  roomkey:string;
  nickname:string;
  nextTimeStamp:number = 0;
  url = '';

  constructor(
    private storage: Storage,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient
  ) {
    this.storage = storage;
    storage.get('nickname').then((val) => this.nickname = (val) ? val : generateNickname());
    this.data.nick = '';
    this.data.timestamp = 0;
    Observable.interval(3000)
      .mergeMap(()    =>  http.get(this.url + '/chat/' + this.timeStamp))
      .subscribe((chats: any[]) => {
        this.nextTimeStamp = this.timeStamp;  // Determine the latest message received so we can just ask for latest
        if (chats !== null) {
            console.log(`Retrieved ${chats.length} messages`);

            // Set the new timestamp for requesting messages
            this.nextTimeStamp = chats[chats.length-1].timestamp + 1;

            // Filter out my own chats from API since page reloaded
            if (this.timeStamp > 0) {
              chats = chats.filter(chat => chat.nick !== this.nickname);
            }

          // If there are chats, add them to the page
          if (chats !== null) {
            console.log(`Got Chats Ending at ${this.timeStamp}`);
            console.log(chats);
            this.chats = this.chats.concat(chats);
            this.content.scrollToBottom(500);
          }
          this.timeStamp = this.nextTimeStamp;  // Now set the global variable for the next timestamp to request
          console.log(`Setting timestamp for messages retrieval to: ${this.timeStamp}`);
        }
        else {
          console.log(`No Messages Pending`);
        }
      },
      (err) => {
        console.log(err);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  goHome() {
    this.navCtrl.push('HomePage');
  }

  sendMessage() {
    this.nickname = this.data.nick || this.nickname;
    this.data.nick = this.nickname;
    this.storage.set('nickname', this.nickname);
    const headers = { 'content-type': 'application/json'}

    this.http.put(this.url + '/chat/', this.data, {'headers': headers}).subscribe(response => {
    }, err => {
      console.log(err);
    });

    this.data.timestamp = Date.now() / 1000;
    console.log(`Sending: from ${this.data.nick}: ${this.data.body}`);
    this.chats.push(JSON.parse(JSON.stringify(this.data)));  // stringify and parse to copy the data
    this.data.body = '';  // Erase the current message field on the screen
    this.content.scrollToBottom(500);
  }

}
