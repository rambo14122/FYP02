import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolvePuzzlePage } from './solve-puzzle';

@NgModule({
  declarations: [
    SolvePuzzlePage,
  ],
  imports: [
    IonicPageModule.forChild(SolvePuzzlePage),
  ],
})
export class SolvePuzzlePageModule {}
