import {Component, NgZone} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {GroupManagerProvider} from '../../../../providers/requests/group-manager/group-manager';
import {GalleryHandlerProvider} from '../../../../providers/utility/gallery-handler/gallery-handler';
import {ToastHandlerProvider} from '../../../../providers/utility/toast-handler/toast-handler';
import {LoaderHandlerProvider} from '../../../../providers/utility/loader-handler/loader-handler';
import {ImageHandlerProvider} from '../../../../providers/utility/image-handler/image-handler';
import {GroupInterface} from '../../../../assets/models/interfaces/GroupInterface';
import {UserLoginProvider} from '../../../../providers/login/user-login/user-login';


@IonicPage()
@Component({
  selector: 'page-group-profile',
  templateUrl: 'group-profile.html',
})
export class GroupProfilePage {
  moveOn = false;
  groupTemp = {} as GroupInterface;

  constructor(public userLoginProvider: UserLoginProvider, public toastHandlerProvider: ToastHandlerProvider, public galleryHandlerProvider: GalleryHandlerProvider, public platform: Platform, public ngZone: NgZone, public loaderHandlerProvider: LoaderHandlerProvider, public ImageHandlerProvider: ImageHandlerProvider, public groupManagerProvider: GroupManagerProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.groupTemp.photoUrl = this.groupManagerProvider.groupImageDefault;
  }

  chooseImage() {
    this.galleryHandlerProvider.setChosenPath(this.galleryHandlerProvider.groupImagePath);
    this.galleryHandlerProvider.setChosenChildAsTimeStamp();
    this.loaderHandlerProvider.presentLoader("Loading image");
    this.galleryHandlerProvider.getImageFromGallery(1).then((url: any) => {
      this.ngZone.run(() => {
        this.groupTemp.photoUrl = url;
      });
      this.loaderHandlerProvider.dismissLoader();
      this.moveOn = true;
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }

  updateProfileImage() {
    if (this.groupTemp.name == "") {
      this.toastHandlerProvider.presentToast("Group name can not be empty");
      return;
    }
    this.groupTemp.groupLeander = this.userLoginProvider.getCurrentUserUid();
    this.loaderHandlerProvider.presentLoader("Updating profile");
    this.groupManagerProvider.updateGroupProfile(this.groupTemp).then(() => {
      this.loaderHandlerProvider.dismissLoader();
      this.toastHandlerProvider.presentToast("Group " + this.groupTemp.name + " created!")
      this.navCtrl.pop();
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }
}
