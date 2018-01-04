import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GroupManagerProvider} from '../../../providers/requests/group-manager/group-manager';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  groupDetails: any;
  groupDetailsArray;
  constructor(public groupManagerProvider: GroupManagerProvider, public events: Events, public navCtrl: NavController, public navParams: NavParams) {
    this.events.subscribe('newGroupDetails', () => {
      if (this.groupManagerProvider.groupDetails != null) {
        this.groupDetails = this.groupManagerProvider.groupDetails;
        this.groupDetailsArray = [];
        for (var groupName in this.groupDetails) {
          this.groupDetailsArray.push(this.groupDetails[groupName]);
        }
        console.log(this.groupDetailsArray);
      }
    });
  }

  createGroup() {
    this.navCtrl.push("GroupProfilePage");
  }

  ionViewWillEnter() {
    this.groupManagerProvider.getGroupDetails();
  }

}
