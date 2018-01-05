import {Component, NgZone, ViewChild} from '@angular/core';
import {Content, Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {LocationInterface} from '../../../../../../assets/models/interfaces/LocationInterface';
import {GalleryHandlerProvider} from '../../../../../../providers/utility/gallery-handler/gallery-handler';
import {ToastHandlerProvider} from '../../../../../../providers/utility/toast-handler/toast-handler';
import {LoaderHandlerProvider} from '../../../../../../providers/utility/loader-handler/loader-handler';
import {GameManagerProvider} from '../../../../../../providers/requests/game-manager/game-manager';
import {PuzzleInterface} from '../../../../../../assets/models/interfaces/PuzzleInterface';

@IonicPage()
@Component({
  selector: 'page-puzzle-detail',
  templateUrl: 'puzzle-detail.html',
})
export class PuzzleDetailPage {
  @ViewChild(Content) content: Content;
  locationDetail = {} as LocationInterface;
  puzzleTemp = {} as PuzzleInterface;
  addPuzzleFlag = false;
  editPuzzleFlag = false;
  puzzleDetails = [];
  gameDetails: any;
  puzzleTempForDisplay = {} as PuzzleInterface;
  contentHeight: any;
  locationId: string;
  puzzleIds = [];
  puzzleIdTemp: string;

  constructor(public toastHandlerProvider: ToastHandlerProvider, public events: Events, public gameManager: GameManagerProvider, public ngZone: NgZone, public loaderHandlerProvider: LoaderHandlerProvider, public galleryHandlerProvider: GalleryHandlerProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.locationDetail = this.navParams.get("locationDetail");
    this.locationId = this.navParams.get("locationId");
    this.puzzleIdTemp = "";
    this.events.subscribe('newPuzzleDetails', () => {
        if (this.gameManager.puzzleDetails != null) {
          console.log(this.gameManager.puzzleDetails);
          this.gameDetails = this.gameManager.puzzleDetails;
          if (this.gameDetails[this.locationId] != null) {
            this.puzzleDetails = [];
            this.puzzleIds = Object.keys(this.gameDetails[this.locationId]);
            for (let puzzleId of this.puzzleIds) {
              this.puzzleTempForDisplay = this.gameDetails[this.locationId][puzzleId];
              this.puzzleDetails[puzzleId] = (this.puzzleTempForDisplay);
            }
            this.puzzleDetails.sort(((a, b) => {
              if (a.order < b.order)
                return -1;
              if (a.order > b.order)
                return 1;
              return 0;
            }))
          }

        }
      }
    );
  }

  ionViewWillEnter() {
    this.gameManager.getPuzzleDetail();
  }

  toggleForm() {
    this.puzzleTemp = {} as PuzzleInterface;
    this.addPuzzleFlag = !this.addPuzzleFlag;

    this.puzzleTemp.title = "";
    this.puzzleTemp.puzzleContent = "";
    this.puzzleTemp.answer = "";
    this.puzzleTemp.hint1 = "";
    this.puzzleTemp.hint2 = "";
    this.puzzleTemp.order = 0;
    this.puzzleTemp.special = false;
    this.puzzleTemp.strictAnswer = false;
    this.puzzleTemp.photoUrl = this.gameManager.puzzleImageDefault;

    this.contentHeight = this.content.scrollHeight - this.content.getContentDimensions().contentTop;
    this.content.scrollTo(0, this.contentHeight-10, 300);
  }

  updatePuzzle() {
    if (this.puzzleTemp.title == "") {
      this.toastHandlerProvider.presentToast("Puzzle title can not be empty");
      return;
    }
    if (!this.editPuzzleFlag) {
      this.puzzleTemp.order = this.puzzleIds.length + 1;
    }
    this.loaderHandlerProvider.presentLoader("Updating puzzle")
    if (this.addPuzzleFlag) {
      this.gameManager.setPuzzleIdbyTimestamp();
    }
    else {
      this.gameManager.puzzleId = this.puzzleIdTemp;
    }

    this.gameManager.updateGamePuzzle(this.puzzleTemp, this.locationId).then(() => {
      this.loaderHandlerProvider.dismissLoader();
      this.cancelUpdate();
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }

  cancelUpdate() {
    this.editPuzzleFlag = false;
    this.addPuzzleFlag = false;
  }

  chooseImage() {
    this.galleryHandlerProvider.setChosenPath(this.galleryHandlerProvider.puzzleImagePath);
    this.galleryHandlerProvider.setChosenChildAsTimeStamp();
    this.galleryHandlerProvider.getImageFromGallery(1).then((url: any) => {
      this.ngZone.run(() => {
        this.puzzleTemp.photoUrl = url;
      });
    }).catch(() => {
    });
  }

  editPuzzle(puzzleDetail, puzzleId) {
    this.editPuzzleFlag = true;
    this.puzzleTemp = puzzleDetail;
    this.puzzleIdTemp = puzzleId;
    this.contentHeight = this.content.scrollHeight - this.content.getContentDimensions().contentTop;
    this.content.scrollTo(0, this.contentHeight-10, 300);

  }

  deletePuzzle(puzzleId) {
    this.loaderHandlerProvider.presentLoader("Deleting puzzle");
    this.gameManager.deleteGamePuzzle(puzzleId, this.locationId).then(() => {
      this.loaderHandlerProvider.dismissLoader();
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }
}
