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
  locationId: string;
  puzzleId: string;
  puzzleDetails={};
  locationDetails={};

  constructor(public events: Events) {
  }

  getPuzzleDetail()
  {
    this.fireDataBase.child('PuzzleTable').on('value', (snapshot) => {
      console.log("changes puzzle detail");
      this.puzzleDetails = snapshot.val();
      this.events.publish('newPuzzleDetails');
    });
  }
  getLocationDetail() {
    this.fireDataBase.child('LocationTable').on('value', (snapshot) => {
      console.log("changes location detail");
      this.locationDetails = snapshot.val();
      this.events.publish('newLocationDetails');
    });
  }

  setLocationIdByTimestamp() {
    this.locationId = (new Date()).getTime() + "";
  }

  updateGameLocation(locationTemp: LocationInterface) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child('LocationTable').child(this.locationId).set(locationTemp).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  deleteGameLocation(locationId) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child('LocationTable').child(locationId).remove().then(() => {
        this.fireDataBase.child('PuzzleTable').child(locationId).remove().then(() => {
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

  setPuzzleIdbyTimestamp() {
    this.puzzleId = (new Date()).getTime() + "";
  }


  updateGamePuzzle(puzzleTemp: PuzzleInterface, locationId) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child('PuzzleTable').child(locationId).child(this.puzzleId).set(puzzleTemp).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }
  deleteGamePuzzle(puzzleId, locationId) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child('PuzzleTable').child(locationId).child(puzzleId).remove().then(() => {
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
