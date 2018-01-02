import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Storage} from '@ionic/storage';
import {ToastHandlerProvider} from '../providers/utility/toast-handler/toast-handler';
import {UserLoginProvider} from '../providers/login/user-login/user-login';
import {ProfileEditorProvider} from '../providers/requests/profile-editor/profile-editor';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = "OpenPage";

  constructor(public profileEditorProvider: ProfileEditorProvider, public userLoginProvider: UserLoginProvider, toastHandleProvider: ToastHandlerProvider, storage: Storage, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      storage.clear();

      storage.get("currentUserUid").then((val) => {
        if (val) {
          this.userLoginProvider.anonymousLogin().then((res: any) => {
            this.profileEditorProvider.checkExistence().then((res: any) => {
              if (res == null) {
                this.profileEditorProvider.setUserProfile().then((res: any) => {
                  this.rootPage = "ProfilePage";
                }).catch(()=>
                {
                  toastHandleProvider.presentToast("Can not set up your profile, check your network");
                });
              }
              else {
                if (res.edited) {
                  this.rootPage = "TabPage";
                }
                else {
                  this.rootPage = "ProfilePage";
                }

              }
            }).catch(() => {
              toastHandleProvider.presentToast("Can not check profile, check your network");
              this.rootPage = "LoginPage";
            });
          }).catch(() => {
            toastHandleProvider.presentToast("Can not log you in, check your network");
            this.rootPage = "LoginPage";
          })

        }
        else {
          this.rootPage = "LoginPage";
        }
      }).catch(() => {
        toastHandleProvider.presentToast("Cant access local storage");
      })


      splashScreen.hide();
    });


  }
}

