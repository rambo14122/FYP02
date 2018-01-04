import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {GroupInterface} from '../../../assets/models/interfaces/GroupInterface';
import {Events} from 'ionic-angular';


@Injectable()
export class GroupManagerProvider {

  groupImageDefault = "https://firebasestorage.googleapis.com/v0/b/fyp02-baa62.appspot.com/o/groupImageDefault.png?alt=media&token=9670abfa-da6e-4e52-a8b6-0bcf57b30f89";
  fireDataBase = firebase.database().ref('/GroupTable');
  groupDetails = {};

  constructor(public events: Events) {
  }

  getGroupDetails() {
    this.fireDataBase.on('value', (snapshot) => {
      this.groupDetails = snapshot.val();
      this.events.publish('newGroupDetails');
    });
  }

  updateGroupProfile(groupTemp: GroupInterface) {

    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child(groupTemp.name).set(groupTemp).then(() => {
        resolve({success: true});
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }


}
