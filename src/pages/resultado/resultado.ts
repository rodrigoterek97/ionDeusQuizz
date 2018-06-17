import { BancoProvider } from './../../providers/banco/banco';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { FaseModel } from '../../models/fase.model';

@IonicPage()
@Component({
	selector: 'page-resultado',
	templateUrl: 'resultado.html',
})
export class ResultadoPage {

	public fase: FaseModel;
	public mensagem: string;
	public pontuacao: number;
	public selecionadas: string[];

	constructor(
		public bancoCtrl: BancoProvider,
		public navCtrl: NavController,
		public navParams: NavParams
	) {
		this.fase = navParams.get('fase');
		this.selecionadas = this.navParams.get('selecionadas');

		this.calcularResultado();

		console.log(this.fase);

	}

	calcularResultado() {
		this.pontuacao = 0;

		this.fase.perguntas.forEach((pergunta, index) => {
			if (this.selecionadas[index] == pergunta.correta)
				this.pontuacao++;
		})

		if (this.pontuacao > 7) {

			this.mensagem = 'Parabéns';

			let update = {};
			update[this.fase.id] = this.selecionadas;
			this.bancoCtrl.saveProgresso(this.fase.area, update);

		} else {
			this.mensagem = 'Poxa vida';
		}


	}

	voltar() {
		this.navCtrl.popToRoot();
	}

}
