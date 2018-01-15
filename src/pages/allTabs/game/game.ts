import {Component, ViewChild} from '@angular/core';
import {Content, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProfileEditorProvider} from '../../../providers/requests/profile-editor/profile-editor';
import {ToastHandlerProvider} from '../../../providers/utility/toast-handler/toast-handler';
import {GroupManagerProvider} from '../../../providers/requests/group-manager/group-manager';
import {GameStatusProvider} from '../../../providers/requests/game-status/game-status';
import {GameManagerProvider} from '../../../providers/requests/game-manager/game-manager';
import {PuzzleStatus} from '../../../assets/models/interfaces/PuzzleStatus';
import {PuzzleInterface} from '../../../assets/models/interfaces/PuzzleInterface';
import {UserLoginProvider} from '../../../providers/login/user-login/user-login';
import {GroupStatus} from '../../../assets/models/interfaces/GroupStatus';


@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})

export class GamePage {
  @ViewChild(Content) content: Content;
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
  groupStart = false;
  gameDetails;
  solvedPuzzles = [];

  constructor(public userLoginProvider: UserLoginProvider, public gameManagerProvider: GameManagerProvider, public gameStatusProvider: GameStatusProvider, public events: Events, public groupManagerProvider: GroupManagerProvider, public toastHandlerProvider: ToastHandlerProvider, public profileEditorProvider: ProfileEditorProvider, public navCtrl: NavController, public navParams: NavParams) {

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
        clearInterval(this.timerInterval);
        this.gameEndTime = this.gameStatusProvider.gameEndTime;
        this.gameEndFlag = true;
        this.gameInProgress = false;
      }
      else {
        this.gameEndFlag = false;
      }
    });
    this.events.subscribe('singleGroupDetail', () => {
      if (this.groupManagerProvider.singleGroupDetail != null) {
        if (this.userLoginProvider.getCurrentUserUid() == this.groupManagerProvider.singleGroupDetail['groupCreator'])
          this.groupLeaderFlag = true;
      }
    });
    this.events.subscribe('newGameDetails', () => {
      if (this.gameManagerProvider.gameDetails != null) {
        this.gameDetails = this.gameManagerProvider.gameDetails;
      }
    })

    this.events.subscribe('gameStatusByGroup', () => {
      this.puzzleStatus = this.gameStatusProvider.gameStatusByGroup;
      console.log("status:", this.puzzleStatus);
      if (this.puzzleStatus == null) {
        this.groupStart = false;
        return;
      }
      if (this.puzzleStatus['finishTime'] != "" && this.puzzleStatus['finishTime'] != null) {
        this.gameFinishFlag = true;
        this.gameManagerProvider.getGameDetail();
      }
      else {
        //todo

        this.gameStartTime = this.gameStatusProvider.gameStartTime;
        this.timer = parseInt(this.gameStatusProvider.getTimeStamp()) - parseInt(this.gameStartTime);
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
          this.timer += 1000;
        }, 1000);

        this.groupStart = true;
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
        this.solvedPuzzles = [];
        for (let puzzleId of this.puzzleIds) {
          this.puzzleStatusTemp = this.puzzleStatus['puzzles'][puzzleId];
          if (this.puzzleStatusTemp.solved) {
            this.solvedPuzzles.push(puzzleId);
          }
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
        this.groupManagerProvider.getSingleGroupDetail(this.groupStatus);
      }).catch(() => {
      });

    }
  }


  startGame() {
    if (this.gameDetails == null) {
      this.toastHandlerProvider.presentToast("Can not fetch game detail, try again later");
      return;
    }
    var locationDetails = this.gameDetails['LocationTable'];
    var puzzleDetails = this.gameDetails['PuzzleTable'];
    var locationIds = Object.keys(locationDetails);
    var finalMapToSet = [];
    var locationOrder = [];
    var puzzleOrder = 0;
    var allPuzzles = [];
    var groupStatus = {} as GroupStatus;
    locationOrder.push(0);
    var randomStartLocation = Math.ceil(Math.random() * (locationIds.length - 1));
    locationOrder.push(randomStartLocation);
    for (var i = 0; i < locationIds.length - 2; i++) {
      randomStartLocation++;
      if (randomStartLocation == locationIds.length) {
        randomStartLocation = 1;
      }
      locationOrder.push(randomStartLocation);
    }
    for (var j = 0; j < locationOrder.length; j++) {
      var locationIdTemp = "";
      for (let locationId of locationIds) {
        if (locationDetails[locationId]['order'] == locationOrder[j]) {
          locationIdTemp = locationId;
          break;
        }
      }
      if (puzzleDetails[locationIdTemp] != null) {
        var puzzleIds = Object.keys(puzzleDetails[locationIdTemp]);
        for (let key of puzzleIds) {
          var puzzleStatus = {} as PuzzleStatus;
          puzzleStatus.hint1 = false;
          puzzleStatus.hint2 = false;
          puzzleStatus.order = puzzleOrder++;
          puzzleStatus.solved = false;
          puzzleStatus.solvedBy = "";
          allPuzzles[key] = puzzleStatus;
        }
      }
    }
    groupStatus.finishTime = "";
    groupStatus.puzzles = allPuzzles;
    groupStatus.point = 50;
    groupStatus.startTime = this.gameStatusProvider.getTimeStamp();
    finalMapToSet[this.groupStatus] = groupStatus;
    this.gameStatusProvider.initializeGroupPuzzles(finalMapToSet).then(() => {
      this.toastHandlerProvider.presentToast("Game started");
    }).catch(() => {
    });
  }

  solveThePuzzle(puzzleId) {
    this.navCtrl.push("SolvePuzzlePage", {
      "GroupId": this.groupStatus,
      "PuzzleId": puzzleId,
      "PuzzleDetail": this.puzzleDetailArray[puzzleId],
      "GameStartTime": this.gameStartTime,
      "Point": this.point,
      "GameProgress": this.solvedPuzzles.length / this.puzzleIds.length
    }).then(() => {
      this.firstUnsolvedId = "";
    });
  }

}
