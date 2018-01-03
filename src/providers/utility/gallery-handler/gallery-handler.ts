import {Injectable} from '@angular/core';
import {ImagePicker} from '@ionic-native/image-picker';
import firebase from 'firebase';
import {Platform} from 'ionic-angular';

/*
  Generated class for the GalleryHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GalleryHandlerProvider {

  fireStore = firebase.storage();

  constructor(public platform: Platform, public imagePicker: ImagePicker) {
  }


  getImageFromGallery(numberOfImage) {
    if (this.platform.is('android')) {
      var promise = new Promise((resolve, reject) => {
        this.imagePicker.requestReadPermission().then((res) => {
          if (res == "OK") {
            this.getImageFromGalleryFurther(numberOfImage);
          }
        }, (err) => {
        });
      });
    }
    else {
      this.getImageFromGalleryFurther(numberOfImage);
    }

  }

  getImageFromGalleryFurther(numberOfImage) {
    let galleryOptions =
      {
        maximumImagesCount: numberOfImage,
        width: 500,
        quality: 50,
        outputType: 1
      };
    var promise = new Promise((resolve, reject) => {
      this.imagePicker.getPictures(galleryOptions).then((results) => {
          if (numberOfImage == 1) {
            var base64String = results[0];
            var byteCharacters = atob(base64String);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var imgBlob = new Blob([byteArray], {type: 'image/jpeg'});
            var imageStore = this.fireStore.ref('/userProfileImages').child(firebase.auth().currentUser.uid);
            imageStore.put(imgBlob).then((res) => {
              this.fireStore.ref('/userProfileImages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
                resolve(url);
              }).catch((err) => {
                reject(err);
              })
            }).catch((err) => {
              reject(err);
            });
          }
        }
      ).catch((err) => {
        console.log(err);
      });
    });
  }

}
