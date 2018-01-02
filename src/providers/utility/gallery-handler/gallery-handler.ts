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
    else
    {
      this.getImageFromGalleryFurther(numberOfImage);
    }

  }

  getImageFromGalleryFurther(numberOfImage) {
    let galleryOptions =
      {
        maximumImagesCount: numberOfImage,
        width: 800
      };
    var promise = new Promise((resolve, reject) => {
      this.imagePicker.getPictures(galleryOptions).then((results) => {
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);

          }
          if (numberOfImage == 1) {
            var url = results[0];
            (<any>window).FilePath.resolveNativePath(url, (result) => {
              var nativePath = result;
              (<any>window).resolveLocalFileSystemURL(nativePath, (res) => {
                res.file((resFile) => {
                  var reader = new FileReader();
                  reader.readAsArrayBuffer(resFile);
                  reader.onloadend = (evt: any) => {
                    var imgBlob = new Blob([evt.target.result], {type: 'image/jpeg'});
                    var imageStore = this.fireStore.ref('/userProfileImages').child(firebase.auth().currentUser.uid);
                    imageStore.put(imgBlob).then((res) => {
                      this.fireStore.ref('/userProfileImages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
                        resolve(url);
                      }).catch((err) => {
                        reject(err);
                      })
                    }).catch((err) => {
                      reject(err);
                    })
                  }
                })
              })
            })
          }
        }
      );
    });
  }

}
