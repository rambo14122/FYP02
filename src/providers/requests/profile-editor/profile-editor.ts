import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {UserLoginProvider} from '../../login/user-login/user-login';
import {UserInterface} from '../../../assets/models/interfaces/UserInterface';

@Injectable()
export class ProfileEditorProvider {

  fireDataBase = firebase.database().ref('/UserTable');
  defaultImageUrl = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e'

  constructor(public userLoginProvider: UserLoginProvider) {
  }

  checkExistence() {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child(this.userLoginProvider.getCurrentUserUid()).once('value', (snapshot) => {
        resolve(snapshot.val());
      })
    });
    return promise;
  }
  updatePersonalGroupStatus(groupIdTemp,memberId) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child(memberId).update({"group": groupIdTemp}).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  updateProfile(userTemp: UserInterface) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child(this.userLoginProvider.getCurrentUserUid()).set(userTemp).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

}
