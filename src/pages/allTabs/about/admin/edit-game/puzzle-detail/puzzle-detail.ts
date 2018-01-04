import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {LocationInterface} from '../../../../../../assets/models/interfaces/LocationInterface';

/**
 * Generated class for the PuzzleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-puzzle-detail',
  templateUrl: 'puzzle-detail.html',
})
export class PuzzleDetailPage {

  locationDetail = {} as LocationInterface;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.locationDetail = this.navParams.get("locationDetail");
  }
}
