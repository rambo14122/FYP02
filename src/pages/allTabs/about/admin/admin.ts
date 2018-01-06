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

    var locationDetails = this.gameDetails['LocationTable'];
    var puzzleDetails = this.gameDetails['PuzzleTable'];
    var locationIds = Object.keys(locationDetails);
    var finalMapToSet = [];
    var locationOrder = [];
    for (let groupId of this.groupDetailKeys) {
      var puzzleOrder = 0;
      var allPuzzles = [];
      var groupStatus = {} as GroupStatus;
      groupStatus.finishTime = "";
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
      groupStatus.puzzles = allPuzzles;
      finalMapToSet[groupId] = groupStatus;
    }


    this.gameStatusProvider.initializeGroupPuzzles(finalMapToSet).then(() => {
      this.toastHandlerProvider.presentToast("Game started");
    }).catch(() => {
    });
    // this.gameStatusProvider.gameStart()
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
