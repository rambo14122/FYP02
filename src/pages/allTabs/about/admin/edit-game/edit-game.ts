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
  locationTempForDisplay = {} as LocationInterface;
  addLocationFlag = false;
  editLocationFlag = false;
  locationDetails;
  randomLocations = [];

  constructor(public toastHandlerProvider: ToastHandlerProvider, public events: Events, public gameManager: GameManagerProvider, public ngZone: NgZone, public loaderHandlerProvider: LoaderHandlerProvider, public galleryHandlerProvider: GalleryHandlerProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.events.subscribe('newGameDetails', () => {
        if (this.gameManager.gameDetails != null) {
          this.gameDetails = this.gameManager.gameDetails;
          for (var tableName in this.gameDetails) {
            if (tableName == 'LocationTable') {
              this.locationDetails = [];
              for (var locationName in this.gameDetails[tableName]) {
                this.locationTempForDisplay = this.gameDetails[tableName][locationName];
                if (this.locationTempForDisplay.type == 'random') {
                  this.randomLocations.push(this.locationTempForDisplay);
                }
                this.locationDetails.push(this.locationTempForDisplay);
              }
              this.locationDetails.sort(((a, b) => {
                if (a.order < b.order)
                  return -1;
                if (a.order > b.order)
                  return 1;
                return 0;
              }))
            }
          }
        }
      }
    )
  }

  ionViewWillEnter() {
    this.gameManager.getGameDetail();

  }

  ionViewDidLeave() {
    this.events.unsubscribe('newGameDetails');
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

  updateLocation() {
    if (this.locationTemp.name == "") {
      this.toastHandlerProvider.presentToast("Location name can not be empty");
      return;
    }
    if (!this.editLocationFlag) {
      if (this.locationTemp.type = 'random') {
        this.locationTemp.order = this.randomLocations.length + 1;
      } else if (this.locationTemp.type = 'start') {
        this.locationTemp.order = 0;
      }
      else {
        this.locationTemp.order = 100;
      }
    }
    this.loaderHandlerProvider.presentLoader("Updating profile")
    this.gameManager.updateGameLocation(this.locationTemp).then(() => {
      this.loaderHandlerProvider.dismissLoader();
      this.cancelUpdate();
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }

  toggleForm() {
    this.locationTemp = {} as LocationInterface;
    this.addLocationFlag = !this.addLocationFlag;
    this.locationTemp.photoUrl = this.gameManager.locationImageDefault;
    this.content.scrollToBottom(1000);
  }

  viewPuzzles(locationDetail) {
    this.navCtrl.push("PuzzleDetailPage", {"locationDetail": locationDetail});
  }

  editLocation(locationDetail) {
    this.editLocationFlag = true;
    this.locationTemp = locationDetail;
    this.content.scrollToBottom(1000);
  }

  deleteLocation(locationDetail) {

  }

  cancelUpdate() {
    this.editLocationFlag = false;
    this.addLocationFlag = false;
  }


}
