import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProfileEditorProvider} from '../../../providers/requests/profile-editor/profile-editor';
import {ToastHandlerProvider} from '../../../providers/utility/toast-handler/toast-handler';
import {GroupManagerProvider} from '../../../providers/requests/group-manager/group-manager';
import {GameStatusProvider} from '../../../providers/requests/game-status/game-status';
import {GameManagerProvider} from '../../../providers/requests/game-manager/game-manager';
import {PuzzleStatus} from '../../../assets/models/interfaces/PuzzleStatus';
import {PuzzleInterface} from '../../../assets/models/interfaces/PuzzleInterface';


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
  timer: any;
  timerInterval: any;
  puzzleDetails: {};
  puzzleStatus: {};
  gameFinishFlag = false;
  puzzleStatusDetails = [];
  puzzleIds = [];
  puzzleStatusTemp = {} as PuzzleStatus;
  puzzleDetailArray = [];
  point = 0;
  firstUnsolvedId: string;

  constructor(public gameManagerProvider: GameManagerProvider, public gameStatusProvider: GameStatusProvider, public events: Events, public groupManagerProvider: GroupManagerProvider, public toastHandlerProvider: ToastHandlerProvider, public profileEditorProvider: ProfileEditorProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.gameInProgress = false;
    this.point = 0;
    this.gameEndFlag = false;
    this.gameStartFlag = false;
    this.gameFinishFlag = false;
    this.puzzleStatusDetails = [];
    this.groupStatus = "";
    this.firstUnsolvedId = "";
    this.profileEditorProvider.setUid();
    this.events.subscribe('userProfileUpdate', () => {
      this.groupStatus = this.profileEditorProvider.currentUserDetail.group;
    });
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
    });

    this.events.subscribe('gameStatusByGroup', () => {
      this.puzzleStatus = this.gameStatusProvider.gameStatusByGroup;
      console.log("status:", this.puzzleStatus);
      if (this.puzzleStatus['finishTime'] != "" && this.puzzleStatus['finishTime'] != null) {
        this.gameFinishFlag = true;
      }
      else {
        this.gameFinishFlag = false;
        this.puzzleStatusDetails = [];
        this.puzzleIds = Object.keys(this.puzzleStatus['puzzles']);
        this.puzzleIds.sort(((a, b): number => {
          if (this.puzzleStatus['puzzles'][a].order < this.puzzleStatus['puzzles'][b].order)
            return -1;
          if (this.puzzleStatus['puzzles'][a].order > this.puzzleStatus['puzzles'][b].order)
            return 1;
          return 0;
        }));
        this.point = this.puzzleStatus['point'];
        for (let puzzleId of this.puzzleIds) {
          this.puzzleStatusTemp = this.puzzleStatus['puzzles'][puzzleId];
          if ((this.firstUnsolvedId == "" || this.firstUnsolvedId == null) && this.puzzleStatusTemp.solved == false) {
            this.firstUnsolvedId = puzzleId;
          }
          this.puzzleStatusDetails[puzzleId] = this.puzzleStatusTemp;
        }
        if (this.puzzleDetails != null) {
          var locationIds = Object.keys(this.puzzleDetails);
          for (let locationId of locationIds) {
            var puzzleMap = this.puzzleDetails[locationId];
            var puzzleMapIds = Object.keys(puzzleMap);
            for (let puzzleId of puzzleMapIds) {
              var puzzleDetailTemp = {} as PuzzleInterface;
              puzzleDetailTemp = puzzleMap[puzzleId];
              this.puzzleDetailArray[puzzleId] = puzzleDetailTemp;
            }
            console.log("details", this.puzzleDetailArray);
          }
        }
      }
    });
  }


  joinGroup() {
    this.navCtrl.push("JoinGroupPage");
  }

  ionViewWillEnter() {
    this.profileEditorProvider.checkExistenceConcurrently();
    this.gameStatusProvider.gameStartListener();
    this.gameStatusProvider.gameEndListener();
    if (this.groupStatus != null && this.groupStatus != '') {
      this.gameManagerProvider.getPuzzleDetailOnce().then((res) => {
        this.puzzleDetails = res;
        this.gameStatusProvider.gameStatusListenerByGroup(this.groupStatus);
      }).catch(() => {
      });

    }
  }

  solveThePuzzle(puzzleId) {

    this.navCtrl.push("SolvePuzzlePage", {
      "GroupId": this.groupStatus,
      "PuzzleId": puzzleId,
      "PuzzleDetail": this.puzzleDetailArray[puzzleId]
    }).then(() => {
      this.firstUnsolvedId = "";
    });
  }

}
