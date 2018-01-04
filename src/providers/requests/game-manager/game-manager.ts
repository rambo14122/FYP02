import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {Events} from 'ionic-angular';
import {LocationInterface} from '../../../assets/models/interfaces/LocationInterface';
import {PuzzleInterface} from '../../../assets/models/interfaces/PuzzleInterface';

@Injectable()
export class GameManagerProvider {
  fireDataBase = firebase.database().ref('/GameTable');
  locationImageDefault = "https://firebasestorage.googleapis.com/v0/b/fyp02-baa62.appspot.com/o/locationDefault.jpg?alt=media&token=f963b888-7601-4e65-a8fc-888f6d4ba4ab";
  gameDetails = {};
  puzzleImageDefault = "https://firebasestorage.googleapis.com/v0/b/fyp02-baa62.appspot.com/o/puzzleImageDefault.png?alt=media&token=778a045a-674d-4e06-88b5-fcd2d35082c5";

  constructor(public events: Events) {
  }


  getGameDetail() {
    this.fireDataBase.on('value', (snapshot) => {
      this.gameDetails = snapshot.val();
      this.events.publish('newGameDetails');
    });
  }

  updateGameLocation(locationTemp: LocationInterface) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child('LocationTable').child(locationTemp.name).set(locationTemp).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  deleteGameLocation(locationTemp: LocationInterface) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child('LocationTable').child(locationTemp.name).remove().then(() => {
        this.fireDataBase.child('PuzzleTable').child(locationTemp.name).remove().then(() => {
          resolve({success: true});
        }).catch((err) => {
          reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  updateGamePuzzle(puzzleTemp: PuzzleInterface, locationDetailName) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child('PuzzleTable').child(locationDetailName).child(puzzleTemp.title).set(puzzleTemp).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  deleteGamePuzzle(puzzleTemp: PuzzleInterface, locationDetailName) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child('PuzzleTable').child(locationDetailName).child(puzzleTemp.title).remove().then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  gameStart() {

  }

  gameEnd() {

  }


}
