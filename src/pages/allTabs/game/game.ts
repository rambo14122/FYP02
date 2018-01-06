import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ProfileEditorProvider} from '../../../providers/requests/profile-editor/profile-editor';
import {ToastHandlerProvider} from '../../../providers/utility/toast-handler/toast-handler';


@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  groupStatus:string;
  constructor(public toastHandlerProvider: ToastHandlerProvider, public profileEditorProvider: ProfileEditorProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.groupStatus = this.profileEditorProvider.currentUserDetail.group;
    if ( this.groupStatus == null ||  this.groupStatus == "") {

    }
  }

 joinGroup()
 {
   this.navCtrl.push("JoinGroupPage");
 }

}
