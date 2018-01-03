import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  constructor(public storage: Storage, public alertController: AlertController, public navCtrl: NavController, public navParams: NavParams) {
  }

  checkIfAdmin() {
    this.storage.get("admin").then(value => {
      if (value) {
        this.navCtrl.push("AdminPage");
      }
      else {
        this.presentPrompt();
      }
    }).catch(() => {
      this.presentPrompt();
    })

  }

  presentPrompt() {
    let alert = this.alertController.create({
      title: 'Admin code',
      inputs: [
        {
          name: 'securityCode',
          placeholder: 'Security Code:'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Login',
          handler: data => {
            if (data.securityCode == "admin") {
              this.storage.set("admin", true);
              this.navCtrl.push("AdminPage");
            } else {
            }
          }
        }
      ]
    });
    alert.present();
  }
}
