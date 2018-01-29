import {Component, NgZone} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {ProfileEditorProvider} from '../../providers/requests/profile-editor/profile-editor';
import {ImageHandlerProvider} from '../../providers/utility/image-handler/image-handler';
import {LoaderHandlerProvider} from '../../providers/utility/loader-handler/loader-handler';
import {GalleryHandlerProvider} from '../../providers/utility/gallery-handler/gallery-handler';
import {ToastHandlerProvider} from '../../providers/utility/toast-handler/toast-handler';
import {UserInterface} from '../../assets/models/interfaces/UserInterface';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userTemp = {} as UserInterface;
  moveOn = false;

  constructor(public toastHandlerProvider: ToastHandlerProvider, public galleryHandlerProvider: GalleryHandlerProvider, public platform: Platform, public ngZone: NgZone, public loaderHandlerProvider: LoaderHandlerProvider, public ImageHandlerProvider: ImageHandlerProvider, public profileEditorProvider: ProfileEditorProvider, public navCtrl: NavController, public navParams: NavParams) {
    if (this.navParams.get("photoUrl") == null || this.navParams.get("photoUrl") == "") {
      this.userTemp.photoUrl = this.profileEditorProvider.defaultImageUrl;
      this.userTemp.edited = false;
    }
    else {
      this.userTemp.name = this.navParams.get("userName");
      this.userTemp.edited = true;
      this.userTemp.photoUrl = this.navParams.get("photoUrl");
      this.userTemp.group = this.navParams.get("group");
    }
  }

  chooseImage() {
    this.moveOn = false;
    this.galleryHandlerProvider.setChosenPath(this.galleryHandlerProvider.profileImagePath);
    this.galleryHandlerProvider.setChosenChildAsUid();
    this.galleryHandlerProvider.getImageFromGallery(1).then((url: any) => {
      this.ngZone.run(() => {
        this.userTemp.photoUrl = url;
      });
      this.moveOn = true;
    }).catch((err) => {
      if (err == false && this.userTemp.photoUrl != this.profileEditorProvider.defaultImageUrl) {
        this.moveOn = true;
      }
    });
  }

  updateProfileImage() {
    if (this.userTemp.name == "" || this.userTemp.name == null) {
      this.toastHandlerProvider.presentToast("Display name can not be empty");
      return;
    }
    this.loaderHandlerProvider.presentLoader("Updating profile");
    this.userTemp.edited = true;
    this.userTemp.group = this.userTemp.group + "";
    this.profileEditorProvider.updateProfile(this.userTemp).then(() => {
      this.loaderHandlerProvider.dismissLoader();
      this.navCtrl.setRoot("TabPage");
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }

  proceed() {
    this.userTemp.photoUrl = this.profileEditorProvider.defaultImageUrl;
    this.updateProfileImage();
  }
}
