import {Injectable} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import firebase from 'firebase';
import {Device} from '@ionic-native/device';
import {Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';

@Injectable()

export class UserLoginProvider {


  constructor(public platform: Platform, public storage: Storage, public device: Device, public angularFireAuth: AngularFireAuth) {
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
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.storage.clear();
      return "rambo1412";
    }
    //for testing only
    return this.device.uuid;
  }

  getCurrentUser() {
    return this.angularFireAuth.auth.currentUser;
  }


}
