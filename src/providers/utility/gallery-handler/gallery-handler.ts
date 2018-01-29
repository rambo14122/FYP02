import {Injectable} from '@angular/core';
import {ImagePicker} from '@ionic-native/image-picker';
import firebase from 'firebase';
import {Platform} from 'ionic-angular';
import {LoaderHandlerProvider} from '../loader-handler/loader-handler';

/*
  Generated class for the GalleryHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GalleryHandlerProvider {

  fireStore = firebase.storage();
  profileImagePath = "/userProfileImages";
  locationImagePath = "/locationImages";
  puzzleImagePath = "/puzzleImages";
  groupImagePath = "/groupImage";
  chosenPath = "";
  chosenChild = "";

  constructor(public loaderHandlerProvider: LoaderHandlerProvider, public platform: Platform, public imagePicker: ImagePicker) {
  }

  setChosenPath(path) {
    this.chosenPath = path;
  }

  setChosenChildAsUid() {
    this.chosenChild = firebase.auth().currentUser.uid
  }

  setChosenChildAsTimeStamp() {
    this.chosenChild = (new Date()).getTime() + "";
  }

  getImageFromGallery(numberOfImage) {
    var promise = new Promise((resolve, reject) => {
      if (this.platform.is('android')) {
        this.imagePicker.requestReadPermission().then((res) => {
          if (res == "OK") {
            this.getImageFromGalleryFurther(numberOfImage).then((url) => {
              resolve(url);
            }).catch((err) => {
              reject(err);
            });
          }
        }, (err) => {
        });
      }
      else {

        this.getImageFromGalleryFurther(numberOfImage).then((url) => {
          resolve(url);
        }).catch((err) => {
          reject(err);
        });

      }
    });
    return promise;
  }

  getImageFromGalleryFurther(numberOfImage) {
    let galleryOptions =
      {
        maximumImagesCount: numberOfImage,
        width: 500,
        quality: 100,
        outputType: 1
      };
    var promise = new Promise((resolve, reject) => {
      this.imagePicker.getPictures(galleryOptions).then((results) => {
          if (numberOfImage == 1) {
            var base64String = results[0];
            var imgBlob = this.getBlob(base64String);
            var imageStore;
            imageStore = this.fireStore.ref(this.chosenPath).child(this.chosenChild);
            imageStore.put(imgBlob).then((res) => {
              this.loaderHandlerProvider.presentLoader("Uploading Image");
              this.fireStore.ref(this.chosenPath).child(this.chosenChild).getDownloadURL().then((url) => {
                resolve(url);
                this.loaderHandlerProvider.dismissLoader();
              }).catch((err) => {
                reject(err);

              })
            }).catch((err) => {
              reject(err);
            });
          }
        }
      ).catch((err) => {
        reject(false);
      });
    });
    return promise;
  }

  getBlob(base64String) {
    var byteCharacters = atob(base64String);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var imgBlob = new Blob([byteArray], {type: 'image/jpeg'});
    return imgBlob;
  }


}
