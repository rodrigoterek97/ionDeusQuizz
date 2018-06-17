import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerguntaPage } from './pergunta';

@NgModule({
  declarations: [
    PerguntaPage,
  ],
  imports: [
    IonicPageModule.forChild(PerguntaPage),
  ],
})
export class PerguntaPageModule {}
