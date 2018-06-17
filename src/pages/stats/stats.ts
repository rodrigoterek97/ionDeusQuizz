import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { AutentProvider } from './../../providers/autent/autent';
import { BancoProvider } from './../../providers/banco/banco';
import { GeradorProvider } from './../../providers/gerador/gerador';

import { AreaModel } from './../../models/area.model';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
	selector: 'page-stats',
	templateUrl: 'stats.html',
})
export class StatsPage {

	public user;
	public areas: AreaModel[];
	public areaShown: string;
	public status: any[];

	constructor(
		public autentCtrl: AutentProvider,
		public bancoCtrl: BancoProvider,
		public gerador: GeradorProvider,
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController
	) {
		this.user = bancoCtrl.user;
		console.log(this.user);

		gerador.getAreas()
			.then(areas => {
				this.areas = areas;
				this.gerarStatus();
			});
	}

	ionViewDidLoad() {

	}

	logout(){
		this.autentCtrl.logout()
			.then(() => {
				this.navCtrl.setRoot(LoginPage);
			})
			.catch(() => {
				this.toastCtrl.create({
					message: "Erro ao realizar logout :(",
					duration: 2000
				}).present();
			});
	}

	selectArea(area: string) {
		if (this.areaShown == area)
			this.areaShown = undefined;
		else
			this.areaShown = area;
	}

	gerarStatus() {

		this.status = [];

		this.areas.forEach(area => {

			let fasesCompletadas = 0;
			let statusFases = []

			area.fases.forEach(fase => {
				if (this.user['progresso-' + area.nome])
					if (this.user['progresso-' + area.nome][fase.id]) {
						fasesCompletadas++;

						let acertos = 0;

						fase.perguntas.forEach((pergunta, index) => {
							if (pergunta.correta == this.user['progresso-' + area.nome][fase.id][index])
								acertos++;
						})

						statusFases.push({
							id: fase.id,
							acertos: acertos * 10
						});
					}
			})

			this.status.push({
				area: area.nome,
				porcentagem: (fasesCompletadas * 100) / area.fases.length,
				step: (100 / area.fases.length),
				fases: statusFases
			});

		})


		console.log(this.status);

	}



}
