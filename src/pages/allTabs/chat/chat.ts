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
  groupStatus: string;
  puzzleStatus: {};
  gameGroupStartFlag = false;
  leaderName: '';
  constructor(public gameStatusProvider: GameStatusProvider, public events: Events, public groupManagerProvider: GroupManagerProvider, public profileEditorProvider: ProfileEditorProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.noGroupFlag = false;
    this.gotGroupFlag = false;
    this.gameInProgress = false;
    this.gameEndFlag = false;
    this.gameStartFlag = false;
    this.profileEditorProvider.setUid();
    this.events.subscribe('userProfileUpdate', () => {
      this.groupStatus = this.profileEditorProvider.currentUserDetail.group;
      if (this.groupStatus == null || this.groupStatus == "") {
        this.noGroupFlag = true;
        this.gotGroupFlag = false;
      }
      else {
        this.groupId = this.groupStatus;
        this.groupManagerProvider.getSingleGroupDetail(this.groupId);
        this.gotGroupFlag = true;
        this.noGroupFlag = false;

      }
    });

    this.singleGroupDetail = {} as GroupInterface;
    this.events.subscribe('singleGroupDetail', () => {
      if (this.groupManagerProvider.singleGroupDetail != null) {
        this.singleGroupDetail = this.groupManagerProvider.singleGroupDetail;
        this.leaderName = this.profileEditorProvider.allUserDetail[this.singleGroupDetail.groupCreator].name;
      }
    });
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
    });
    this.events.subscribe('gameStatusByGroup', () => {

      this.puzzleStatus = this.gameStatusProvider.gameStatusByGroup;
      if (this.puzzleStatus == null) {
        this.gameGroupStartFlag = false;
        return;
      }
      if (this.puzzleStatus['finishTime'] != "" && this.puzzleStatus['finishTime'] != null) {
        this.gameEndFlag = true;
        this.gameGroupStartFlag = false;
      }
      else {
        this.gameGroupStartFlag = true;
      }
    });
  }

  ionViewWillEnter() {
    this.gameStatusProvider.gameStartListener();
    this.gameStatusProvider.gameEndListener();
    this.profileEditorProvider.checkExistenceConcurrently();
    if (this.groupStatus != null && this.groupStatus != '') {
      this.gameStatusProvider.gameStatusListenerByGroup(this.groupStatus);
    }

  }

  joinGroup() {
    this.navCtrl.push("JoinGroupPage");
  }

  changeGroup() {
    this.navCtrl.push("JoinGroupPage");
  }

}
