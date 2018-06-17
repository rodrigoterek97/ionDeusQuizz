import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { GeradorProvider } from './../../providers/gerador/gerador';

import { AreaModel } from './../../models/area.model';

@IonicPage()
@Component({
	selector: 'page-about',
	templateUrl: 'about.html',
})
export class AboutPage {

	public ranking: any[];
	public rankingFixo: any[];
	public selectedFilter: string;
	public selectedFilterText: string;
	private areas: AreaModel[];
	private alertButtons: any[];

	constructor(
		public actionSheetCtrl: ActionSheetController,
		public geradorCtrl: GeradorProvider,
		public navCtrl: NavController,
		public navParams: NavParams
	) {
		this.areas = geradorCtrl.areas;
		geradorCtrl.getRanking()
			.then(rkn => {
				this.rankingFixo = rkn;
				this.buildRanking();
				console.log(this.ranking);
			})
		this.buildButtons();
	}

	buildRanking() {

		this.rankingFixo.forEach(usuario => {

			let total = 0;

			for (const key in usuario) {
				const valor = usuario[key];

				if (key != 'nick') {
					total += valor;
				}
			}

			usuario['total'] = total;

		});

		this.ordenarRanking('total');

	}

	buildButtons() {
		this.alertButtons = [];

		this.alertButtons.push({
			text: 'Total',
			handler: () => {
				this.ordenarRanking('total');
			}
		});

		this.areas.forEach(area => {
			this.alertButtons.push({
				text: area.nome,
				handler: () => {
					this.ordenarRanking(area.nome)
				}
			})
		})
	}

	selectFilter() {

		this.actionSheetCtrl.create({
			title: 'Selecione uma área:',
			buttons: this.alertButtons,
			cssClass: 'action-sheet-select'
		}).present();

	}

	ordenarRanking(area: string) {
		this.selectedFilter = area;

		if (area != 'total') {
			this.ranking = this.rankingFixo.sort((a, b) => {
				if (a[area] > b[area])
					return -1;
				if (a[area] < b[area])
					return 1;
				return 0;
			})

			this.selectedFilterText = " em " + area;
		} else {
			this.ranking = this.rankingFixo.sort((a, b) => {
				if (a.total > b.total)
					return -1;
				if (a.total < b.total)
					return 1;
				return 0;
			})

			this.selectedFilterText = "";
		}
	}

}
