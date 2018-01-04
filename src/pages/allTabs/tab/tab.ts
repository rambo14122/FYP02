import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Keyboard} from '@ionic-native/keyboard';


@IonicPage()
@Component({
  selector: 'page-tab',
  templateUrl: 'tab.html',
})
export class TabPage {

  tab1: string = 'GamePage';
  tab2: string = 'ChatPage';
  tab3: string = 'AboutPage';

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }
}
