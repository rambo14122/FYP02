import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {Events} from 'ionic-angular';
import {UserLoginProvider} from '../../login/user-login/user-login';

@Injectable()
export class GameStatusProvider {
  fireDataBase = firebase.database().ref('/GameStatus');
  gameStartTime: string;
  gameEndTime: string;
  gameStatusByGroup = {};
  gameStatusByPuzzle = {};

  constructor(public events: Events, public uerLoginProvider: UserLoginProvider) {
    this.gameStartTime = "";
    this.gameEndTime = "";
  }

  getTimeStamp() {
    return (new Date()).getTime() + "";
  }

  sendFireBaseTimeStamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  startGame() {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.set({"start": this.sendFireBaseTimeStamp(), "GroupTable": "", "end": ""}).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  initializeGroupPuzzles(finalMapToSet) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child("GroupTable").set(finalMapToSet).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }


  gameEnd() {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.update({"end": this.sendFireBaseTimeStamp()}).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  groupPuzzleSetup(groupId) {
  }

  gameStartListener() {
    this.fireDataBase.child('start').on('value', (snapshot) => {
      this.gameStartTime = snapshot.val();
      this.events.publish('newGameStart');
    });
  }

  gameStatusListenerByGroup(groupId) {
    this.fireDataBase.child('GroupTable').child(groupId).on('value', (snapshot) => {
      this.gameStatusByGroup = snapshot.val();
      this.events.publish('gameStatusByGroup');
    });
  }

  gameStatusListenerByPuzzle(groupId, puzzleId) {
    this.fireDataBase.child('GroupTable').child(groupId).child('puzzles').child(puzzleId).on('value', (snapshot) => {
      this.gameStatusByPuzzle = snapshot.val();
      this.events.publish('gameStatusByPuzzle');
    });
  }

  revealHint1(groupId, puzzleId) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child('GroupTable').child(groupId).child('puzzles').child(puzzleId).update({hint1: true}).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  uploadCorrectAnswer(groupId, puzzleId) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child('GroupTable').child(groupId).child('puzzles').child(puzzleId).update({
        solved: true,
        solvedBy: this.uerLoginProvider.getCurrentUserUid()
      }).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  revealHint2(groupId, puzzleId) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child('GroupTable').child(groupId).child('puzzles').child(puzzleId).update({hint2: true}).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  gameEndListener() {
    this.fireDataBase.child('end').on('value', (snapshot) => {
      this.gameEndTime = snapshot.val();
      this.events.publish('newGameEnd');
    });
  }
}
