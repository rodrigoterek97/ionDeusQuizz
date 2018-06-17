import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PerguntaPage } from '../pergunta/pergunta';

import { BancoProvider } from './../../providers/banco/banco';
import { GeradorProvider } from '../../providers/gerador/gerador';

import { AreaModel } from './../../models/area.model';
import { FaseModel } from './../../models/fase.model';

@IonicPage()
@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
})
export class HomePage {

	public areas: AreaModel[];
	private user;


	constructor(
		public bancoCtrl: BancoProvider,
		public fasesCtrl: GeradorProvider,
		public navCtrl: NavController,
		public navParams: NavParams
	) {
		this.user = this.bancoCtrl.user;

		console.log(this.user);

	}

	ionViewWillEnter() {
		this.fasesCtrl.getAreas()
			.then(result => {
				this.areas = result;
				this.buildFases();
				console.log(this.areas);
			})
	}

	entrarFase(fase: FaseModel) {
		if (fase.faseFeita) {
			this.navCtrl.push(PerguntaPage, {
				fase: fase,
				selecionadas: this.user['progresso-' + fase.area][fase.id]
			})
		} else {
			this.navCtrl.push(PerguntaPage, {
				fase: fase
			})
		}
	}

	private buildFases() {
		this.areas.forEach(area => {
			area.fases.forEach(fase => {
				if (this.user['progresso-' + area.nome])
					if (this.user['progresso-' + area.nome][fase.id])
						fase.faseFeita = true;
				fase.faseDisp = this.verificarReq(fase);
			})
		})
	}

	private verificarReq(fase: FaseModel): boolean {
		if (fase.requerimento) {

			let ok = true;

			fase.requerimento.forEach(req => {

				if (this.user['progresso-' + req.area]) {
					if (!this.user['progresso-' + req.area][req.id]) {
						ok = false;
						return;
					}
				} else {
					ok = false;
					return;
				}

			})

			return ok;

		} else {
			return true;
		}
	}

}
