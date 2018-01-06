import {Component, NgZone} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {GroupManagerProvider} from '../../../../providers/requests/group-manager/group-manager';
import {GalleryHandlerProvider} from '../../../../providers/utility/gallery-handler/gallery-handler';
import {ToastHandlerProvider} from '../../../../providers/utility/toast-handler/toast-handler';
import {LoaderHandlerProvider} from '../../../../providers/utility/loader-handler/loader-handler';
import {ImageHandlerProvider} from '../../../../providers/utility/image-handler/image-handler';
import {GroupInterface} from '../../../../assets/models/interfaces/GroupInterface';
import {UserLoginProvider} from '../../../../providers/login/user-login/user-login';
import {ProfileEditorProvider} from '../../../../providers/requests/profile-editor/profile-editor';


@IonicPage()
@Component({
  selector: 'page-group-profile',
  templateUrl: 'group-profile.html',
})
export class GroupProfilePage {
  moveOn = false;
  groupTemp = {} as GroupInterface;

  constructor(public profileEditorProvider: ProfileEditorProvider, public userLoginProvider: UserLoginProvider, public toastHandlerProvider: ToastHandlerProvider, public galleryHandlerProvider: GalleryHandlerProvider, public platform: Platform, public ngZone: NgZone, public loaderHandlerProvider: LoaderHandlerProvider, public ImageHandlerProvider: ImageHandlerProvider, public groupManagerProvider: GroupManagerProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.groupTemp.photoUrl = this.groupManagerProvider.groupImageDefault;
  }

  chooseImage() {
    this.galleryHandlerProvider.setChosenPath(this.galleryHandlerProvider.groupImagePath);
    this.galleryHandlerProvider.setChosenChildAsTimeStamp();
    this.galleryHandlerProvider.getImageFromGallery(1).then((url: any) => {
      this.ngZone.run(() => {
        this.groupTemp.photoUrl = url;
      });
      this.moveOn = true;
    }).catch(() => {
    });
  }

  updateProfileImage() {
    if (this.groupTemp.name == "") {
      this.toastHandlerProvider.presentToast("Group name can not be empty");
      return;
    }
    this.loaderHandlerProvider.presentLoader("Updating team profile");
    this.groupManagerProvider.setGroupIdByTimeStamp();
    this.groupManagerProvider.updateGroupProfile(this.groupTemp).then(() => {
      this.groupManagerProvider.updateGroupMember(this.userLoginProvider.getCurrentUserUid()).then(() => {
        this.profileEditorProvider.updatePersonalGroupStatus(this.groupManagerProvider.groupId, this.userLoginProvider.getCurrentUserUid()).then(() => {
          this.loaderHandlerProvider.dismissLoader();
          this.navCtrl.setRoot("TabPage");
        }).catch(() => {
          this.loaderHandlerProvider.dismissLoader();
        });
      }).catch(() => {
      });
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }
}
