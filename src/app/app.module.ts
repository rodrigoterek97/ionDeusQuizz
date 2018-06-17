import { CadastroPage } from './../pages/cadastro/cadastro';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { HomePageModule } from '../pages/home/home.module';
import { LoginPage } from '../pages/login/login';
import { PerguntaPage } from '../pages/pergunta/pergunta';
import { ResultadoPage } from '../pages/resultado/resultado';
import { StatsPage } from '../pages/stats/stats';
import { TabsPage } from '../pages/tabs/tabs';

import { GeradorProvider } from '../providers/gerador/gerador';
import { BancoProvider } from '../providers/banco/banco';
import { AutentProvider } from '../providers/autent/autent';

const config: FirebaseAppConfig = {
  apiKey: "AIzaSyDNGJW3H7iy7bPquHG61jIbgkWkh8rGBZo",
  authDomain: "deusquizz.firebaseapp.com",
  databaseURL: "https://deusquizz.firebaseio.com",
  projectId: "deusquizz",
  storageBucket: "deusquizz.appspot.com",
  messagingSenderId: "1077163783868"
};

@NgModule({
  declarations: [
    AboutPage,
    CadastroPage,
    MyApp,
    LoginPage,
    PerguntaPage,
    ResultadoPage,
    StatsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HomePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AboutPage,
    CadastroPage,
    MyApp,
    LoginPage,
    PerguntaPage,
    ResultadoPage,
    StatsPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AutentProvider,
    BancoProvider,
    GeradorProvider
  ]
})
export class AppModule {}
