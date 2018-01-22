import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GroupManagerProvider} from '../../../../providers/requests/group-manager/group-manager';
import {GroupInterface} from '../../../../../platforms/android/build/intermediates/assets/debug/www/assets/models/interfaces/GroupInterface';
import {ProfileEditorProvider} from '../../../../providers/requests/profile-editor/profile-editor';
import {UserLoginProvider} from '../../../../providers/login/user-login/user-login';
import {LoaderHandlerProvider} from '../../../../providers/utility/loader-handler/loader-handler';
import {ToastHandlerProvider} from '../../../../providers/utility/toast-handler/toast-handler';

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
  tempForDisplayKeys: any;

  constructor(public toastHandlerProvider: ToastHandlerProvider, public loaderHandlerProvider: LoaderHandlerProvider, public userLoginProvider: UserLoginProvider, public profileEditorProvider: ProfileEditorProvider, public groupManagerProvider: GroupManagerProvider, public events: Events, public navCtrl: NavController, public navParams: NavParams) {
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
        this.tempForDisplayKeys = this.groupDetailKeys;
        for (let key of this.groupDetailKeys) {
          if (this.groupDetails[key]['member'] != null) {
            this.memberNumber[key] = (Object.keys(this.groupDetails[key]['member']).length);
          }

        }
      }
    });


  }

  searchGroup(searchBar) {
    this.tempForDisplayKeys = this.groupDetailKeys;
    var query = searchBar.target.value;
    if (query == '' || query == null||query.trim() == '' || query.trim() == null) {
      return;
    }
    if (!isNaN(query)) {
      query = parseInt(query) + '';
    }
    query = query.toLowerCase();
    this.tempForDisplayKeys = this.tempForDisplayKeys.filter((key) => {

      if (((this.groupDetails[key]['groupNumber'] + '').toLowerCase().indexOf(query) > -1) || ((this.groupDetails[key]['name']).toLowerCase().indexOf(query) > -1)) {
        return true;
      }
      else {
        return false;
      }
    })
  }

  joinGroup(groupId) {
    this.loaderHandlerProvider.presentLoader("Joining Group");
    if (this.groupStatus != null && this.groupStatus != '') {
      var memberId = this.userLoginProvider.getCurrentUserUid();
      var memberKey = Object.keys(this.groupDetails[this.groupStatus]['member']).find(key => this.groupDetails[groupId]['member'][key] === memberId);
      this.deleteAlgorithm(this.groupStatus, memberId, memberKey).then(() => {
      }).catch(() => {
      });
    }
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
    var memberId = this.userLoginProvider.getCurrentUserUid();
    var memberKey = Object.keys(this.groupDetails[groupId]['member']).find(key => this.groupDetails[groupId]['member'][key] === memberId);
    this.profileEditorProvider.updatePersonalGroupStatus("", memberId).then(() => {
      this.deleteAlgorithm(groupId, memberId, memberKey).then(() => {
      }).catch(() => {
      });
    }).catch(() => {
    });


  }

  deleteAlgorithm(groupId, memberId, memberKey) {
    var promise = new Promise((resolve, reject) => {
      if (this.memberNumber[groupId] > 1 && memberId != this.groupDetails[groupId]['groupCreator']) {
        this.groupManagerProvider.quitGroup(groupId, memberKey).then(() => {
        }).catch(() => {
          this.toastHandlerProvider.presentToast("You have quited the group");
        });
      }
      else {
        this.groupManagerProvider.deleteGroup(groupId).then(() => {
          this.toastHandlerProvider.presentToast("You have dismissed the group");
        });
      }
    });
    return promise;
  }
}
