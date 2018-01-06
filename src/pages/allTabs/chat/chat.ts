import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProfileEditorProvider} from '../../../providers/requests/profile-editor/profile-editor';
import {GroupManagerProvider} from '../../../providers/requests/group-manager/group-manager';
import {GroupInterface} from '../../../../platforms/android/build/intermediates/assets/debug/www/assets/models/interfaces/GroupInterface';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  noGroupFlag = false;
  gotGroupFlag = false;
  groupId: string;
  singGroupDetail = {} as GroupInterface;

  constructor(public events: Events, public groupManagerProvider: GroupManagerProvider, public profileEditorProvider: ProfileEditorProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.noGroupFlag = false;
    this.gotGroupFlag = false;
    var groupStatus = this.profileEditorProvider.currentUserDetail.group;
    if (groupStatus == null || groupStatus == "") {
      this.noGroupFlag = true;
    }
    else {
      this.groupId = groupStatus;
      this.gotGroupFlag = true;
      this.singGroupDetail = {} as GroupInterface;
      this.events.subscribe('singleGroupDetail', () => {
        if (this.groupManagerProvider.singleGroupDetail != null) {
          this.singGroupDetail = this.groupManagerProvider.singleGroupDetail;
        }
      });
    }

  }

  ionViewWillEnter() {
    if (this.groupId != null) {
      this.groupManagerProvider.getSingleGroupDetail(this.groupId);
    }

  }

  joinGroup() {
    this.navCtrl.push("JoinGroupPage");
  }

  changeGroup() {

  }

}
