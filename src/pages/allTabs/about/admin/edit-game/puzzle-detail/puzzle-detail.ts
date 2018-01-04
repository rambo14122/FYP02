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
  puzzleDetails;
  gameDetails: any;
  puzzleTempForDisplay = {} as PuzzleInterface;
  contentHeight: any;

  constructor(public toastHandlerProvider: ToastHandlerProvider, public events: Events, public gameManager: GameManagerProvider, public ngZone: NgZone, public loaderHandlerProvider: LoaderHandlerProvider, public galleryHandlerProvider: GalleryHandlerProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.locationDetail = this.navParams.get("locationDetail");
    this.events.subscribe('newGameDetails', () => {
        if (this.gameManager.gameDetails != null) {
          this.gameDetails = this.gameManager.gameDetails;
          for (var tableName in this.gameDetails) {
            if (tableName == "PuzzleTable") {
              this.puzzleDetails = [];
              for (var puzzleName in this.gameDetails[tableName][this.locationDetail.name]) {
                this.puzzleTempForDisplay = this.gameDetails[tableName][this.locationDetail.name][puzzleName];
                this.puzzleDetails.push(this.puzzleTempForDisplay);
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
      }
    );
  }

  ionViewWillEnter() {
    this.gameManager.getGameDetail();
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

    this.contentHeight = this.content.scrollHeight-this.content.getContentDimensions().contentTop;
    console.log(this.contentHeight);
    this.content.scrollTo(0, this.contentHeight, 300);
  }

  updatePuzzle() {
    if (this.puzzleTemp.title == "") {
      this.toastHandlerProvider.presentToast("Puzzle title can not be empty");
      return;
    }
    if (!this.editPuzzleFlag) {

    }
    this.loaderHandlerProvider.presentLoader("Updating puzzle")
    this.gameManager.updateGamePuzzle(this.puzzleTemp, this.locationDetail.name).then(() => {
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
    this.loaderHandlerProvider.presentLoader("Loading image");
    this.galleryHandlerProvider.getImageFromGallery(1).then((url: any) => {
      this.ngZone.run(() => {
        this.puzzleTemp.photoUrl = url;
      });
      this.loaderHandlerProvider.dismissLoader();
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }

  editPuzzle(puzzleDetail) {
    this.editPuzzleFlag = true;
    this.puzzleTemp = puzzleDetail;
    this.contentHeight = this.content.scrollHeight-this.content.getContentDimensions().contentTop;
    console.log(this.contentHeight);
    this.content.scrollTo(0, this.contentHeight, 300);

  }

  deletePuzzle(puzzleDetail) {
    this.loaderHandlerProvider.presentLoader("Deleting puzzle");
    this.gameManager.deleteGamePuzzle(puzzleDetail, this.locationDetail.name).then(() => {
      this.loaderHandlerProvider.dismissLoader();
    }).catch(() => {
      this.loaderHandlerProvider.dismissLoader();
    });
  }
}
