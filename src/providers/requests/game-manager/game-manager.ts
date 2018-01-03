import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {Events} from 'ionic-angular';

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
      console.log(this.gameDetails);
      this.events.publish('gameDetails');
    });
  }

  editGameLocation(location) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child('Location').update({
        location
      }).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  deleteGameLocation() {

  }

  editGamePuzzle() {

  }

  deleteGamePuzzle() {

  }

  gameStart() {

  }

  gameEnd() {

  }


}
