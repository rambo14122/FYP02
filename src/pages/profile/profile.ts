import {Component, NgZone} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {ProfileEditorProvider} from '../../providers/requests/profile-editor/profile-editor';
import {ImageHandlerProvider} from '../../providers/utility/image-handler/image-handler';
import {LoaderHandlerProvider} from '../../providers/utility/loader-handler/loader-handler';
import {GalleryHandlerProvider} from '../../providers/utility/gallery-handler/gallery-handler';

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

  constructor(public galleryHandlerProvider:GalleryHandlerProvider,public platform:Platform,public ngZone:NgZone,public loaderHandlerProvider:LoaderHandlerProvider,public ImageHandlerProvider:ImageHandlerProvider,public profileEditorProvider: ProfileEditorProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.imageUrl = this.profileEditorProvider.defaultImageUrl;
  }

  chooseImage()
  {
    this.galleryHandlerProvider.getImageFromGallery(1);
    // this.ImageHandlerProvider.uploadimage().then((uploadUrl: any) => {
    //   this.ngZone.run(() => {
    //     this.imageUrl = uploadUrl;
    //   })
    // }).catch(()=>{
    // });
  }
  updateProfileImage()
  {

  }
}
