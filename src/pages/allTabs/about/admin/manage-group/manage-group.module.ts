import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageGroupPage } from './manage-group';

@NgModule({
  declarations: [
    ManageGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageGroupPage),
  ],
})
export class ManageGroupPageModule {}
