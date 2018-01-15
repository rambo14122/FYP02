import {Injectable} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import firebase from 'firebase';
import {Device} from '@ionic-native/device';

@Injectable()

export class UserLoginProvider {


  constructor(public device: Device, public angularFireAuth: AngularFireAuth) {
  }

  anonymousLogin() {
    var promise = new Promise((resolve, reject) => {
      this.angularFireAuth.auth.signInAnonymously().then(() => {
        resolve(true);
      })
    });
    return promise;
  }

  getCurrentUserUid() {

    //for testing only
    return "rambo1412";
    // return this.device.uuid;
  }

  getCurrentUser() {
    return this.angularFireAuth.auth.currentUser;
  }


}
