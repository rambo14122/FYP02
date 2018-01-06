import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GameManagerProvider} from '../../../../providers/requests/game-manager/game-manager';
import {GameStatusProvider} from '../../../../providers/requests/game-status/game-status';
import {ToastHandlerProvider} from '../../../../providers/utility/toast-handler/toast-handler';

/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {
  gameInProgress = false;
  gameEndFlag = false;
  gameStartFlag = false;
  gameStartTime: string;
  gameEndTime: string;
  timer: any;
  timerInterval: any;
  timerString: string;

  constructor(public toastHandlerProvider: ToastHandlerProvider, public events: Events, public gameStatusProvider: GameStatusProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.gameInProgress = false;
    this.gameEndFlag = false;
    this.gameStartFlag = false;

    this.events.subscribe('newGameStart', () => {
      if (this.gameStatusProvider.gameStartTime != null && this.gameStatusProvider.gameStartTime != "") {
        this.gameStartTime = this.gameStatusProvider.gameStartTime;
        this.gameStartFlag = true;
        this.gameInProgress = true;
        this.timer = parseInt(this.gameStatusProvider.getTimeStamp()) - parseInt(this.gameStartTime);

        this.timerInterval = setInterval(() => {
          this.timer += 1000;
          this.timerString = this.msToTime(this.timer);
        }, 1000);
      }
      else {
        this.gameInProgress = false;
        this.gameStartFlag = false;
      }
    });
    this.events.subscribe('newGameEnd', () => {
      if (this.gameStatusProvider.gameEndTime != null && this.gameStatusProvider.gameEndTime != "") {
        clearInterval(this.timerInterval);
        this.gameEndTime = this.gameStatusProvider.gameEndTime;
        this.gameEndFlag = true;
        this.gameInProgress = false;
      }
      else {
        this.gameEndFlag = false;
      }
    })
  }

  msToTime(duration) {
    var seconds = Math.floor((duration / 1000) % 60);
    var minutes = Math.floor((duration / (1000 * 60)) % 60);
    var hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return ((hours < 10) ? "0" + hours : hours) + ":" + ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds);
  }

  editGame() {
    this.navCtrl.push("EditGamePage");
  }

  manageGroup() {

  }

  manageUser() {

  }

  gameStart() {
    this.gameStatusProvider.gameStart().then(() => {
      this.toastHandlerProvider.presentToast("Game started");
    }).catch(() => {
    });
  }

  gameEnd() {
    this.gameStatusProvider.gameEnd().then(() => {
      this.toastHandlerProvider.presentToast("Game ended");
    }).catch(() => {
    });
  }

  ionViewWillEnter() {
    this.gameStatusProvider.gameStartListener();
    this.gameStatusProvider.gameEndListener();
  }

}
