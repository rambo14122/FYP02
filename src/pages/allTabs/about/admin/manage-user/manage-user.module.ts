import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManageUserPage } from './manage-user';

@NgModule({
  declarations: [
    ManageUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ManageUserPage),
  ],
})
export class ManageUserPageModule {}
