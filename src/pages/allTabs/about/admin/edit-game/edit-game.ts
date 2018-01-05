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
  contentHeight: any;
  locationIds = [];
  locationIdTemp: string;

  constructor(public toastHandlerProvider: ToastHandlerProvider, public events: Events, public gameManager: GameManagerProvider, public ngZone: NgZone, public loaderHandlerProvider: LoaderHandlerProvider, public galleryHandlerProvider: GalleryHandlerProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.locationIdTemp = "";
    this.events.subscribe('newLocationDetails', () => {
        if (this.gameManager.locationDetails != null) {
          this.gameDetails = this.gameManager.locationDetails;
              this.locationDetails = [];
              this.randomLocations = [];
              this.locationIds = Object.keys(this.gameDetails);
              for (let locationId of this.locationIds) {
                this.locationTempForDisplay = this.gameDetails[locationId];
                if (this.locationTempForDisplay.type == 'random') {
                  this.randomLocations.push(this.locationTempForDisplay);
                }
                this.locationDetails[locationId] = (this.locationTempForDisplay);
              }
              this.locationDetails.sort(((a, b) => {
                if (a.order < b.order)
                  return -1;
                if (a.order > b.order)
                  return 1;
                return 0;
              }));

        }
      }
    )
  }

  ionViewWillEnter() {
    this.gameManager.getLocationDetail();

  }

  ionViewDidLoad() {

  }

  chooseImage() {
    this.galleryHandlerProvider.setChosenPath(this.galleryHandlerProvider.locationImagePath);
    this.galleryHandlerProvider.setChosenChildAsTimeStamp();
    this.galleryHandlerProvider.getImageFromGallery(1).then((url: any) => {
      this.ngZone.run(() => {
        this.locationTemp.photoUrl = url;
      });
    }).catch(() => {
    });
  }

  updateLocation() {
    if (this.locationTemp.name == "") {
      this.toastHandlerProvider.presentToast("Location name can not be empty");
      return;
    }
    if (!this.editLocationFlag) {
      if (this.locationTemp.type == 'random') {
        this.locationTemp.order = this.randomLocations.length + 1;
      } else if (this.locationTemp.type == 'start') {
        this.locationTemp.order = 0;
      }
      else {
        this.locationTemp.order = 100;
      }
    }
    this.loaderHandlerProvider.presentLoader("Updating location");
    if (this.addLocationFlag) {
      this.gameManager.setLocationIdByTimestamp();
    }
    else {
      this.gameManager.locationId = this.locationIdTemp;
    }
    this.gameManager.updateGameLocation(this.locationTemp).then(() => {
      this.loaderHandlerProvider.dismissLoader();
      this.cancelUpdate();
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }

  toggleForm() {
    this.contentHeight = this.content.scrollHeight - this.content.getContentDimensions().contentTop;
    this.locationTemp = {} as LocationInterface;
    this.addLocationFlag = !this.addLocationFlag;

    this.locationTemp.name = "";
    this.locationTemp.type = "random";
    this.locationTemp.order = 0;
    this.locationTemp.photoUrl = this.gameManager.locationImageDefault;

    this.content.scrollTo(0, this.contentHeight-10, 300);
  }

  viewPuzzles(locationDetail, locationId) {
    this.navCtrl.push("PuzzleDetailPage", {"locationDetail": locationDetail, "locationId": locationId});
  }

  editLocation(locationDetail, locationId) {
    this.editLocationFlag = true;
    this.locationTemp = locationDetail;
    this.contentHeight = this.content.scrollHeight - this.content.getContentDimensions().contentTop;
    this.locationIdTemp = locationId;
    this.content.scrollTo(0, this.contentHeight-10, 300);
  }

  deleteLocation(locationId) {
    this.loaderHandlerProvider.presentLoader("Deleting location");
    this.gameManager.deleteGameLocation(locationId).then(() => {
      this.loaderHandlerProvider.dismissLoader();
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }

  cancelUpdate() {
    this.editLocationFlag = false;
    this.addLocationFlag = false;
  }


}
