import { Injectable } from '@angular/core';
import { ToastController} from 'ionic-angular';
@Injectable()
export class ToastHandlerProvider {

  constructor(public toastController:ToastController) {
  }
  presentToast(toastMessage)
  {
    var toast = this.toastController.create(
      {
        message: '',
        duration: 3000,
        position: 'top'
      }
    );
    toast.setMessage(toastMessage);
    toast.present();
  }
}
