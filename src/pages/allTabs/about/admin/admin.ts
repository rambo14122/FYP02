import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GameManagerProvider} from '../../../../providers/requests/game-manager/game-manager';

/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  editGame() {
    this.navCtrl.push("EditGamePage");
  }

  manageGroup() {

  }

  manageUser() {

  }

  gameStart() {

  }

  gameEnd() {

  }


}
