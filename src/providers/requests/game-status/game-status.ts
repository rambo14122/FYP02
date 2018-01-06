import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {Events} from 'ionic-angular';

@Injectable()
export class GameStatusProvider {
  fireDataBase = firebase.database().ref('/GameStatus');
  gameStartTime: string;
  gameEndTime: string;
  gameStatusByGroup = {};
  gameStatusByPuzzle = {};

  constructor(public events: Events) {
    this.gameStartTime = "";
    this.gameEndTime = "";
  }

  getTimeStamp() {
    return (new Date()).getTime() + "";
  }

  initializeGroupPuzzles(finalMapToSet) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.set({"start": this.getTimeStamp(), "GroupTable": finalMapToSet, "end": ""}).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }


  gameEnd() {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.update({"end": this.getTimeStamp()}).then(() => {
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

  gameStatusListenerPuzzle(groupId, puzzleId) {
    this.fireDataBase.child('GroupTable').child(groupId).child('puzzles').child('puzzleId').on('value', (snapshot) => {
      this.gameStatusByPuzzle = snapshot.val();
      this.events.publish('gameStatusByPuzzle');
    });
  }


  gameEndListener() {
    this.fireDataBase.child('end').on('value', (snapshot) => {
      this.gameEndTime = snapshot.val();
      this.events.publish('newGameEnd');
    });
  }
}
