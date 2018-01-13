import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GroupManagerProvider} from '../../../../providers/requests/group-manager/group-manager';
import {GroupInterface} from '../../../../../platforms/android/build/intermediates/assets/debug/www/assets/models/interfaces/GroupInterface';
import {ProfileEditorProvider} from '../../../../providers/requests/profile-editor/profile-editor';
import {UserLoginProvider} from '../../../../providers/login/user-login/user-login';
import {LoaderHandlerProvider} from '../../../../providers/utility/loader-handler/loader-handler';

@IonicPage()
@Component({
  selector: 'page-join-group',
  templateUrl: 'join-group.html',
})
export class JoinGroupPage {

  groupDetails: any;
  groupDetailKeys: any = [];
  memberNumber: any = [];
  groupStatus: string;

  constructor(public loaderHandlerProvider: LoaderHandlerProvider, public userLoginProvider: UserLoginProvider, public profileEditorProvider: ProfileEditorProvider, public groupManagerProvider: GroupManagerProvider, public events: Events, public navCtrl: NavController, public navParams: NavParams) {
    this.memberNumber = [];
    this.groupStatus = "";
    this.events.subscribe('userProfileUpdate', () => {
      this.groupStatus = this.profileEditorProvider.currentUserDetail.group;
      if (this.groupStatus == null || this.groupStatus == "") {
      }
    });

    this.events.subscribe('newGroupDetails', () => {
      console.log(this.groupManagerProvider.groupDetails);
      if (this.groupManagerProvider.groupDetails != null) {
        this.groupDetails = this.groupManagerProvider.groupDetails;
        this.groupDetailKeys = Object.keys(this.groupDetails);
        for (let key of this.groupDetailKeys) {
          if (this.groupDetails[key]['member'] != null) {
            this.memberNumber[key] = (Object.keys(this.groupDetails[key]['member']).length);
          }

        }
      }
    });


  }

  joinGroup(groupId) {
    this.loaderHandlerProvider.presentLoader("Joining Group");
    this.groupManagerProvider.updateGroupMember(groupId, this.userLoginProvider.getCurrentUserUid()).then(() => {
      this.profileEditorProvider.updatePersonalGroupStatus(groupId, this.userLoginProvider.getCurrentUserUid()).then(() => {
        this.loaderHandlerProvider.dismissLoader();
        if (this.navCtrl.canGoBack()) {
          this.navCtrl.pop();
        }
      }).catch(() => {
        this.loaderHandlerProvider.dismissLoader();
      });
    }).catch(() => {
    });
  }

  createGroup() {
    this.navCtrl.push("GroupProfilePage");
  }

  ionViewWillEnter() {
    this.groupManagerProvider.getGroupDetails();
    this.profileEditorProvider.checkExistenceConcurrently();
  }

  ionViewDidLeave() {
  }

  quitGroup(groupId) {
    this.groupManagerProvider.quitGroup(groupId, this.userLoginProvider.getCurrentUserUid()).then(() => {

    }).catch(() => {

    });
  }
}
