import {Injectable} from '@angular/core';
import {LoadingController} from 'ionic-angular';

@Injectable()
export class LoaderHandlerProvider {

  loader: any;

  constructor(public loadingController: LoadingController) {
  }

  presentLoader(loaderMessage) {
    this.loader = this.loadingController.create(
      {content: loaderMessage});
    this.loader.present();
  }
  dismissLoader()
  {
    this.loader.dismiss();
  }
}
