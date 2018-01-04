import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PuzzleDetailPage } from './puzzle-detail';

@NgModule({
  declarations: [
    PuzzleDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PuzzleDetailPage),
  ],
})
export class PuzzleDetailPageModule {}
