import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupManageMentPage } from './group-manage-ment';

@NgModule({
  declarations: [
    GroupManageMentPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupManageMentPage),
  ],
})
export class GroupManageMentPageModule {}
