import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserLoginProvider} from '../../providers/login/user-login/user-login';
import {ToastHandlerProvider} from '../../providers/utility/toast-handler/toast-handler';
import {LoaderHandlerProvider} from '../../providers/utility/loader-handler/loader-handler';
import {Storage} from '@ionic/storage';
import {ProfileEditorProvider} from '../../providers/requests/profile-editor/profile-editor';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public profileEditorProvider: ProfileEditorProvider, public storage: Storage, public loaderHandlerProvider: LoaderHandlerProvider, public toastHandleProvider: ToastHandlerProvider, public userLoginProvider: UserLoginProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  anonymousLogin() {
    this.loaderHandlerProvider.presentLoader("Login in progress");
    this.userLoginProvider.anonymousLogin().then((res: any) => {
      this.toastHandleProvider.presentToast("login success");
      this.loaderHandlerProvider.dismissLoader();
      this.storage.set("currentUserUid", this.userLoginProvider.getCurrentUserUid());
      this.profileEditorProvider.checkExistence().then((res: any) => {
          if (res == null) {
            this.profileEditorProvider.setUserProfile().then((res: any) => {
              this.navCtrl.setRoot("ProfilePage");
            }).catch(() => {
              this.toastHandleProvider.presentToast("Can not set up your profile, check your network");
            });
          }
          else {
            if (res.edited) {
              this.navCtrl.setRoot("TabPage");
            }
            else {
              this.navCtrl.setRoot("ProfilePage");
            }
          }
        }
      )

    }).catch((error) => {
      this.toastHandleProvider.presentToast(error.message);
      this.loaderHandlerProvider.dismissLoader();
    })
  }


}
