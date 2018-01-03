import {Component, NgZone} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {ProfileEditorProvider} from '../../providers/requests/profile-editor/profile-editor';
import {ImageHandlerProvider} from '../../providers/utility/image-handler/image-handler';
import {LoaderHandlerProvider} from '../../providers/utility/loader-handler/loader-handler';
import {GalleryHandlerProvider} from '../../providers/utility/gallery-handler/gallery-handler';
import {ToastHandlerProvider} from '../../providers/utility/toast-handler/toast-handler';

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
  imageUrl = "";
  displayName = "";

  constructor(public toastHandlerProvider: ToastHandlerProvider, public galleryHandlerProvider: GalleryHandlerProvider, public platform: Platform, public ngZone: NgZone, public loaderHandlerProvider: LoaderHandlerProvider, public ImageHandlerProvider: ImageHandlerProvider, public profileEditorProvider: ProfileEditorProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.imageUrl = this.profileEditorProvider.defaultImageUrl;
  }

  chooseImage() {
    this.loaderHandlerProvider.presentLoader("Loading image");
    this.galleryHandlerProvider.getImageFromGallery(1).then((url: any) => {
      this.ngZone.run(() => {
        this.imageUrl = url;
      });
      this.loaderHandlerProvider.dismissLoader();
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }

  updateProfileImage() {
    if (this.displayName == "") {
      this.toastHandlerProvider.presentToast("Display name can not be empty");
      return;
    }
    this.loaderHandlerProvider.presentLoader("Updating profile")
    this.profileEditorProvider.updateProfileImage(this.displayName, this.imageUrl).then(() => {
      this.loaderHandlerProvider.dismissLoader();
      this.navCtrl.setRoot("TabPage");
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }
}
