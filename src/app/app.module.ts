import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import {AngularFireModule} from "angularfire2";
import {AngularFireAuth} from "angularfire2/auth";
import {config} from "./firebaseConfig";
import { IonicStorageModule } from '@ionic/storage';
import { UserLoginProvider } from '../providers/login/user-login/user-login';
import { ToastHandlerProvider } from '../providers/utility/toast-handler/toast-handler';
import { LoaderHandlerProvider } from '../providers/utility/loader-handler/loader-handler';
import { ProfileEditorProvider } from '../providers/requests/profile-editor/profile-editor';
import { ImageHandlerProvider } from '../providers/utility/image-handler/image-handler';

import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { GalleryHandlerProvider } from '../providers/utility/gallery-handler/gallery-handler';
import { ImagePicker } from '@ionic-native/image-picker';
import { GameManagerProvider } from '../providers/requests/game-manager/game-manager';
import { Keyboard } from '@ionic-native/keyboard';
@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsPlacement: 'top',scrollAssist: true, autoFocusAssist: true}),
    AngularFireModule.initializeApp(config),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    ImagePicker,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireAuth,
    UserLoginProvider,
    ToastHandlerProvider,
    LoaderHandlerProvider,
    ProfileEditorProvider,
    ImageHandlerProvider,
    File,
    FileChooser,
    FilePath,
    GalleryHandlerProvider,
    GameManagerProvider,
    Keyboard
  ]
})
export class AppModule {}
