import {Injectable} from '@angular/core';
import firebase from 'firebase';
import {GroupInterface} from '../../../assets/models/interfaces/GroupInterface';
import {Events} from 'ionic-angular';
import {UserLoginProvider} from '../../login/user-login/user-login';


@Injectable()
export class GroupManagerProvider {

  groupImageDefault = "https://firebasestorage.googleapis.com/v0/b/fyp02-baa62.appspot.com/o/groupImageDefault.png?alt=media&token=9670abfa-da6e-4e52-a8b6-0bcf57b30f89";
  fireDataBase = firebase.database().ref('/GroupTable');
  groupDetails = {};
  singleGroupDetail = {} as GroupInterface
  groupId: string;

  constructor(public userLoginProvider: UserLoginProvider, public events: Events) {
  }

  getGroupDetails() {
    this.fireDataBase.on('value', (snapshot) => {
      this.groupDetails = snapshot.val();
      this.events.publish('newGroupDetails');
    });
  }

  setGroupIdByTimeStamp() {
    return (new Date()).getTime() + "";
  }

  updateGroupProfile(groupId, groupTemp: GroupInterface) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child(groupId).set(groupTemp).then(() => {
        resolve({success: true});
        console.log("successProfile")
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  updateGroupMember(groupId, memberId) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child(groupId).child('member').push(memberId).then(() => {
        resolve({success: true});
      });
    });
    return promise;
  }

  getSingleGroupDetail(groupId) {
    if (groupId == null || groupId == "")
      return;
    this.fireDataBase.child(groupId).on('value', (snapshot) => {
      this.singleGroupDetail = snapshot.val();
      this.events.publish('singleGroupDetail');
    });
  }

  quitGroup(groupId, memberId) {
    var promise = new Promise((resolve, reject) => {
      this.fireDataBase.child(groupId).child('member').remove(memberId).then(() => {
        resolve({success: true});
      }).catch(() => {

      });
    });
    return promise;
  }

}
