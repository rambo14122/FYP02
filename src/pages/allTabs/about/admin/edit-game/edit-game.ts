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
  gameDetails: any;
  locationTemp = {} as LocationInterface;
  showForm = false;
  locationDetails: LocationInterface[];

  constructor(public toastHandlerProvider: ToastHandlerProvider, public events: Events, public gameManager: GameManagerProvider, public ngZone: NgZone, public loaderHandlerProvider: LoaderHandlerProvider, public galleryHandlerProvider: GalleryHandlerProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.locationTemp.photoUrl = this.gameManager.locationImageDefault;
  }

  ionViewWillEnter() {
    this.gameManager.getGameDetail();
    this.events.subscribe('gameDetails', () => {
        if (this.gameManager.gameDetails != null) {
          this.gameDetails = this.gameManager.gameDetails;
          for (let [key, value] of Object.entries(this.gameDetails["LocationTable"])) {
            this.locationDetails.push(value);
          }
          console.log(this.locationDetails);
          console.log(this.locationDetails.name);
        }
      }
    )
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
        this.locationTemp.photoUrl = url;
      });
      this.loaderHandlerProvider.dismissLoader();
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }

  addLocation() {
    if (this.locationTemp.name == "") {
      this.toastHandlerProvider.presentToast("Location name can not be empty");
      return;
    }
    if (this.locationTemp.type = 'random') {
      this.locationTemp.order = 1;
    } else {
      this.locationTemp.order = 0;
    }
    this.loaderHandlerProvider.presentLoader("Updating profile")
    this.gameManager.updateGameLocation(this.locationTemp).then(() => {
      this.loaderHandlerProvider.dismissLoader();
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.content.scrollToBottom(1000);
  }


}
