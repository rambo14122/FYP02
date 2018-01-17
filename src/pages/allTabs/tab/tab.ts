import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';
import {ProfileEditorProvider} from '../../../providers/requests/profile-editor/profile-editor';


@IonicPage()
@Component({
  selector: 'page-tab',
  templateUrl: 'tab.html',
})
export class TabPage {

  tab1: string = 'GamePage';
  tab2: string = 'ChatPage';
  tab3: string = 'AboutPage';

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public profileEditorProvider: ProfileEditorProvider) {
    this.events.subscribe("allUserProfile", () => {
    });
  }

  ionViewWillEnter() {
    this.profileEditorProvider.getAllUserInfo();
  }
}
