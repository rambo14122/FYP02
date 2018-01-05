import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProfileEditorProvider} from '../../../providers/requests/profile-editor/profile-editor';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  noGroupFlag=true;
  constructor(public profileEditorProvider: ProfileEditorProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.noGroupFlag=true;
    this.profileEditorProvider.checkExistence().then((res: any) => {
      console.log(res);
      if (res.group == null || res.group == "") {
          this.noGroupFlag=true;
      }
      else {
        this.noGroupFlag=false;
      }
    }).catch(() => {

    });
  }

  joinGroup() {
    this.navCtrl.push("JoinGroupPage");
  }

}
