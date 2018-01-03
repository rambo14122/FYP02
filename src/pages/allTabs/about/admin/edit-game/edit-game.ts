import {Component, NgZone, ViewChild} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Content} from 'ionic-angular';
import {GalleryHandlerProvider} from '../../../../../providers/utility/gallery-handler/gallery-handler';
import {LoaderHandlerProvider} from '../../../../../providers/utility/loader-handler/loader-handler';
import {GameManagerProvider} from '../../../../../providers/requests/game-manager/game-manager';
import {ToastHandlerProvider} from '../../../../../providers/utility/toast-handler/toast-handler';
import {LocationInterface} from '../../../../../assets/models/interfaces/LocationInterface';

@IonicPage()
@Component({
  selector: 'page-edit-game',
  templateUrl: 'edit-game.html',
})
export class EditGamePage {
  @ViewChild(Content) content: Content;
  gameDetails:any;
  location = {} as LocationInterface;
  showForm = false;

  constructor(public toastHandlerProvider:ToastHandlerProvider,public events:Events,public gameManager: GameManagerProvider, public ngZone: NgZone, public loaderHandlerProvider: LoaderHandlerProvider, public galleryHandlerProvider: GalleryHandlerProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.location.photoUrl = this.gameManager.locationImageDefault;
  }
  ionViewWillEnter() {
    this.gameManager.getGameDetail();
    this.events.subscribe('gameDetails', () => {
      this.gameDetails = this.gameManager.gameDetails;
    })
  }
  ionViewDidLeave() {
    this.events.unsubscribe('gameDetails');
  }
  chooseImage() {
    this.galleryHandlerProvider.setChosenPath(this.galleryHandlerProvider.locationImagePath);
    this.galleryHandlerProvider.setChosenChildAsTimeStamp();
    this.loaderHandlerProvider.presentLoader("Loading image");
    this.galleryHandlerProvider.getImageFromGallery(1).then((url: any) => {
      this.ngZone.run(() => {
        this.location.photoUrl = url;
      });
      this.loaderHandlerProvider.dismissLoader();
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }

  addLocation() {
    if (this.location.name == "") {
      this.toastHandlerProvider.presentToast("Location name can not be empty");
      return;
    }
    if(this.location.type='random')
    {
      this.location.order=1;
    }
    console.log(this.location);
    // this.loaderHandlerProvider.presentLoader("Updating profile")
    // this.gameManager.editGameLocation(location).then(() => {
    //   this.loaderHandlerProvider.dismissLoader();
    // }).catch(() => {
    //   this.loaderHandlerProvider.dismissLoader();
    // });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.content.scrollToBottom(1000);
  }


}
