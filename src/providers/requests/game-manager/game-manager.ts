import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {Events} from 'ionic-angular';
import {LocationInterface} from '../../../assets/models/interfaces/LocationInterface';

@Injectable()
export class GameManagerProvider {
  fireDataBase = firebase.database().ref('/GameTable');
  locationImageDefault = "https://firebasestorage.googleapis.com/v0/b/fyp02-baa62.appspot.com/o/locationDefault.jpg?alt=media&token=f963b888-7601-4e65-a8fc-888f6d4ba4ab";
  gameDetails = {};
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
    })
    return promise;
  }

  deleteGameLocation() {

  }

  updateGamePuzzle() {

  }

  deleteGamePuzzle() {

  }

  gameStart() {

  }

  gameEnd() {

  }


}
