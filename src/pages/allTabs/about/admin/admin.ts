import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GameManagerProvider} from '../../../../providers/requests/game-manager/game-manager';
import {GameStatusProvider} from '../../../../providers/requests/game-status/game-status';
import {ToastHandlerProvider} from '../../../../providers/utility/toast-handler/toast-handler';
import {GroupManagerProvider} from '../../../../providers/requests/group-manager/group-manager';
import {PuzzleStatus} from '../../../../assets/models/interfaces/PuzzleStatus';
import {GroupStatus} from '../../../../assets/models/interfaces/GroupStatus';
import {LocationInterface} from '../../../../assets/models/interfaces/LocationInterface';
import {sortedChanges} from 'angularfire2/firestore';
import {PuzzleInterface} from '../../../../assets/models/interfaces/PuzzleInterface';


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
  groupDetails: any;
  groupDetailKeys: any = [];
  gameDetails;


  constructor(public gameManagerProvider: GameManagerProvider, public groupManagerProvider: GroupManagerProvider, public toastHandlerProvider: ToastHandlerProvider, public events: Events, public gameStatusProvider: GameStatusProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.gameInProgress = false;
    this.gameEndFlag = false;
    this.gameStartFlag = false;
    this.events.subscribe('newGroupDetails', () => {
      if (this.groupManagerProvider.groupDetails != null) {
        this.groupDetails = this.groupManagerProvider.groupDetails;
        this.groupDetailKeys = Object.keys(this.groupDetails);
      }
    });
    this.events.subscribe('newGameDetails', () => {
      if (this.gameManagerProvider.gameDetails != null) {
        this.gameDetails = this.gameManagerProvider.gameDetails;
      }
    })
    this.events.subscribe('newGameStart', () => {
      if (this.gameStatusProvider.gameStartTime != null && this.gameStatusProvider.gameStartTime != "") {
        this.gameStartTime = this.gameStatusProvider.gameStartTime;
        this.gameStartFlag = true;
        this.gameInProgress = true;
        this.timer = parseInt(this.gameStatusProvider.getTimeStamp()) - parseInt(this.gameStartTime);
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
          this.timer += 1000;
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


  editGame() {
    this.navCtrl.push("EditGamePage");
  }

  manageGroup() {

  }

  manageUser() {

  }

  gameStart() {
    if (this.gameDetails == null) {
      this.toastHandlerProvider.presentToast("Can not fetch game detail, try again later");
      return;
    }
    if (this.groupDetailKeys == null) {
      this.toastHandlerProvider.presentToast("No group yet!");
      return;
    }

    this.gameStatusProvider.startGame();
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
    this.groupManagerProvider.getGroupDetails();
    this.gameManagerProvider.getGameDetail();
  }

}
