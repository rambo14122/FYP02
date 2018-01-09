import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GameStatusProvider} from '../../../../providers/requests/game-status/game-status';
import {PuzzleInterface} from '../../../../assets/models/interfaces/PuzzleInterface';
import {ToastHandlerProvider} from '../../../../providers/utility/toast-handler/toast-handler';

@IonicPage()
@Component({
  selector: 'page-solve-puzzle',
  templateUrl: 'solve-puzzle.html',
})
export class SolvePuzzlePage {
  puzzleToSolveId: string;
  puzzleDetail = {} as PuzzleInterface;
  groupStatus: string;
  puzzleStatus = {};

  constructor(public toastHandlerProvider: ToastHandlerProvider, public events: Events, public gameStatusProvider: GameStatusProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.puzzleToSolveId = this.navParams.get("PuzzleId");
    this.puzzleDetail = this.navParams.get("PuzzleDetail");
    this.groupStatus = this.navParams.get("GroupId");
    this.events.subscribe('gameStatusByPuzzle', () => {
      if (this.gameStatusProvider.gameStatusByPuzzle != null) {
        this.puzzleStatus = this.gameStatusProvider.gameStatusByPuzzle;
      }
    });
  }

  ionViewWillEnter() {
    this.gameStatusProvider.gameStatusListenerByPuzzle(this.groupStatus, this.puzzleToSolveId);
  }

  revealHint(hint) {
    if (hint == 'hint1') {
      this.gameStatusProvider.revealHint1(this.groupStatus, this.puzzleToSolveId).then(() => {
      }).catch(() => {
      });
    }
    if (hint == 'hint2') {
      this.gameStatusProvider.revealHint2(this.groupStatus, this.puzzleToSolveId).then(() => {
      }).catch(() => {
      });
    }
  }

  answerQuestion() {
    var answer = "";
    if (this.puzzleStatus['strict']) {
      if (answer != this.puzzleDetail.answer) {
        this.toastHandlerProvider.presentToast("Wrong answer");
        return;
      }
    }
    else {
      if (answer.trim().indexOf(this.puzzleDetail.answer.trim()) < 0 && this.puzzleDetail.answer.trim().indexOf(answer.trim()) < 0) {
        this.toastHandlerProvider.presentToast("Wrong answer");
        return;
      }
    }
    this.gameStatusProvider.uploadCorrectAnswer(this.groupStatus, this.puzzleToSolveId).then(() => {
      this.toastHandlerProvider.presentToast("Corrent answer!");
      if (this.navCtrl.canGoBack()) {
        this.navCtrl.pop();
      }
    }).catch(() => {
    });
  }
}
