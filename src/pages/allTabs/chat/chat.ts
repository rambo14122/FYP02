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
  noGroupFlag = true;
  groupId: string;
  singGroupDetail = {} as GroupInterface;

  constructor(public events: Events, public groupManagerProvider: GroupManagerProvider, public profileEditorProvider: ProfileEditorProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.noGroupFlag = true;
    this.profileEditorProvider.checkExistence().then((res: any) => {
      if (res.group == null || res.group == "") {
        this.noGroupFlag = true;
      }
      else {
        this.groupId = res.group;
        this.noGroupFlag = false;
        // this.singGroupDetail = {} as GroupInterface;
        // this.groupManagerProvider.getGroupDetails();
        // this.events.subscribe('singleGroupDetail', () => {
        //   if (this.groupManagerProvider.singleGroupDetail != null) {
        //     this.singGroupDetail = this.groupManagerProvider.singleGroupDetail;
        //     console.log(this.singGroupDetail);
        //   }
        // });
      }
    }).catch(() => {

    });
  }

  joinGroup() {
    this.navCtrl.push("JoinGroupPage");
  }

  changeGroup() {

  }

}
