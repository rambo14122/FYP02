import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ProfileEditorProvider} from '../../../providers/requests/profile-editor/profile-editor';
import {UserInterface} from '../../../assets/models/interfaces/UserInterface';


@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  currentUser = {} as UserInterface;

  constructor(public events: Events, public profileEditorProvider: ProfileEditorProvider, public storage: Storage, public alertController: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    this.currentUser = {} as UserInterface;
    this.events.subscribe('userProfileUpdate', () => {
      this.currentUser = this.profileEditorProvider.currentUserDetail;
    });
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

  ionViewWillEnter() {
    this.profileEditorProvider.checkExistenceConcurrently();
  }


  editProfile() {
    this.navCtrl.push("ProfilePage", {'photoUrl': this.currentUser.photoUrl, 'userName': this.currentUser.name});
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
