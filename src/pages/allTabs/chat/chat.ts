import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProfileEditorProvider} from '../../../providers/requests/profile-editor/profile-editor';
import {GroupManagerProvider} from '../../../providers/requests/group-manager/group-manager';
import {GroupInterface} from '../../../assets/models/interfaces/GroupInterface';
import {GameStatusProvider} from '../../../providers/requests/game-status/game-status';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  noGroupFlag = false;
  gotGroupFlag = false;
  groupId: string;
  singleGroupDetail = {} as GroupInterface;
  gameInProgress = false;
  gameEndFlag = false;
  gameStartFlag = false;

  constructor(public gameStatusProvider: GameStatusProvider, public events: Events, public groupManagerProvider: GroupManagerProvider, public profileEditorProvider: ProfileEditorProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.noGroupFlag = false;
    this.gotGroupFlag = false;
    this.gameInProgress = false;
    this.gameEndFlag = false;
    this.gameStartFlag = false;
    this.events.subscribe('newGameStart', () => {
      if (this.gameStatusProvider.gameStartTime != null && this.gameStatusProvider.gameStartTime != "") {
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
        this.gameEndFlag = true;
        this.gameInProgress = false;
      }
      else {
        this.gameEndFlag = false;
      }
    })

    var groupStatus = this.profileEditorProvider.currentUserDetail.group;
    if (groupStatus == null || groupStatus == "") {
      this.noGroupFlag = true;
    }
    else {
      this.groupId = groupStatus;
      this.gotGroupFlag = true;
      this.singleGroupDetail = {} as GroupInterface;
      this.events.subscribe('singleGroupDetail', () => {
        if (this.groupManagerProvider.singleGroupDetail != null) {
          this.singleGroupDetail = this.groupManagerProvider.singleGroupDetail;
        }
      });
    }

  }

  ionViewWillEnter() {
    if (this.groupId != null) {
      this.groupManagerProvider.getSingleGroupDetail(this.groupId);
    }
    this.gameStatusProvider.gameStartListener();
    this.gameStatusProvider.gameEndListener();
  }

  joinGroup() {
    this.navCtrl.push("JoinGroupPage");
  }

  changeGroup() {

  }

}
