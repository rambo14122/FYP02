import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-solve-puzzle',
  templateUrl: 'solve-puzzle.html',
})
export class SolvePuzzlePage {
  puzzleToSolveId: string;
  puzzleDetailsArray = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.puzzleToSolveId = this.navParams.get("PuzzleId");
    this.puzzleDetailsArray = this.navParams.get("PuzzleDetails");
  }
}
