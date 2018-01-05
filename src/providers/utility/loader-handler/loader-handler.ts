import {Injectable} from '@angular/core';
import {LoadingController} from 'ionic-angular';
import {ToastHandlerProvider} from '../toast-handler/toast-handler';

@Injectable()
export class LoaderHandlerProvider {

  loader: any;

  constructor(public toastHandlerProvider: ToastHandlerProvider, public loadingController: LoadingController) {
  }

  presentLoader(loaderMessage) {
    this.loader = this.loadingController.create(
      {content: loaderMessage});
    this.loader.present();
  }

  dismissLoader() {
    this.loader.dismiss();
  }
}
