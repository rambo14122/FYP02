import {Injectable} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import firebase from 'firebase';

@Injectable()

export class UserLoginProvider {



  constructor(public angularFireAuth: AngularFireAuth) {
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
    return this.angularFireAuth.auth.currentUser.uid;
  }
  getCurrentUser()
  {
    return this.angularFireAuth.auth.currentUser;
  }


}
