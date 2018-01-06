import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProfileEditorProvider} from '../../../providers/requests/profile-editor/profile-editor';
import {ToastHandlerProvider} from '../../../providers/utility/toast-handler/toast-handler';
import {GroupManagerProvider} from '../../../providers/requests/group-manager/group-manager';
import {GroupInterface} from '../../../../platforms/android/build/intermediates/assets/debug/www/assets/models/interfaces/GroupInterface';
import {GameStatusProvider} from '../../../providers/requests/game-status/game-status';


@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  groupStatus: string;
  groupLeaderFlag = false;
  gameInProgress = false;
  gameEndFlag = false;
  gameStartFlag = false;
  gameStartTime: string;
  gameEndTime: string;

  constructor(public gameStatusProvider: GameStatusProvider, public events: Events, public groupManagerProvider: GroupManagerProvider, public toastHandlerProvider: ToastHandlerProvider, public profileEditorProvider: ProfileEditorProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.gameInProgress = false;
    this.gameEndFlag = false;
    this.gameStartFlag = false;
    this.groupStatus = this.profileEditorProvider.currentUserDetail.group;
    this.groupLeaderFlag = this.groupManagerProvider.groupLeaderFlag;

    this.events.subscribe('newGameStart', () => {
      if (this.gameStatusProvider.gameStartTime != null && this.gameStatusProvider.gameStartTime != "") {
        this.gameStartTime = this.gameStatusProvider.gameStartTime;
        this.gameStartFlag = true;
        this.gameInProgress = true;
      }
      else {
        this.gameInProgress = false;
        this.gameStartFlag = false;
      }
    });
    this.events.subscribe('newGameEnd', () => {
      if (this.gameStatusProvider.gameEndTime != null && this.gameStatusProvider.gameEndTime != "") {
        this.gameEndTime = this.gameStatusProvider.gameEndTime;
        this.gameEndFlag = true;
        this.gameInProgress = false;
      }
      else {
        this.gameEndFlag = false;
      }
    })
  }

  joinGroup() {
    this.navCtrl.push("JoinGroupPage");
  }

  ionViewWillEnter() {
    this.gameStatusProvider.gameStartListener();
    this.gameStatusProvider.gameEndListener();
  }

}
