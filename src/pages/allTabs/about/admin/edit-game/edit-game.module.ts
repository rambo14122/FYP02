import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditGamePage } from './edit-game';

@NgModule({
  declarations: [
    EditGamePage,
  ],
  imports: [
    IonicPageModule.forChild(EditGamePage),
  ],
})
export class EditGamePageModule {}
