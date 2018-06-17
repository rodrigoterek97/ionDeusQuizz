import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Platform } from 'ionic-angular';

import { FaseModel } from '../../models/fase.model';
import { PerguntaModel } from '../../models/pergunta.model';
import { ResultadoPage } from '../resultado/resultado';

@IonicPage()
@Component({
	selector: 'page-pergunta',
	templateUrl: 'pergunta.html',
})
export class PerguntaPage {

	public acao: string;
	public alternativaSelecionada: string;
	public fase: FaseModel;
	public numero: number;
	public pergunta: PerguntaModel;

	private selecionadas: string[];
	private unregisterBackButton: Function;

	constructor(
		public alertCtrl: AlertController,
		public navCtrl: NavController,
		public navParams: NavParams,
		public plt: Platform,
		public toastCtrl: ToastController
	) {
		this.fase = navParams.get('fase');

		if (this.fase.faseFeita)
			this.selecionadas = navParams.get('selecionadas');
		else
			this.selecionadas = [];

		this.numero = 0;
		this.setPergunta();
		console.log(this.selecionadas);
		console.log(this.fase);

	}

	ionViewWillEnter() {
		this.unregisterBackButton = this.plt.registerBackButtonAction(() => { this.cancelar() });
	}

	ionViewWillLeave() {
		this.unregisterBackButton();
	}

	cancelar() {
		if (this.fase.faseFeita) {
			this.navCtrl.pop();
		} else {
			this.alertCtrl.create({
				title: 'Atenção!',
				subTitle: 'Tem certeza que deseja sair da fase?',
				buttons: [{
					text: 'Não',
					role: 'cancel'
				}, {
					text: 'Sim',
					handler: () => {
						this.navCtrl.pop();
					}
				}]
			}).present()
		}
	}

	anterior() {
		this.numero--;
		this.setPergunta();
	}

	proxima() {

		if (this.alternativaSelecionada) {

			this.selecionadas[this.numero] = this.alternativaSelecionada;

			if (this.acao == 'Concluir') {

				if (this.fase.faseFeita) {

					this.navCtrl.pop();

				} else {

					this.navCtrl.push(ResultadoPage, {
						fase: this.fase,
						selecionadas: this.selecionadas
					})
				}

			} else {

				this.numero++;
				this.setPergunta();
			}

		} else {
			this.toastCtrl.create({
				message: "Você deve selecionar uma das alternativas",
				duration: 1500
			}).present();
		}

	}

	private setPergunta() {
		this.pergunta = this.fase.perguntas[this.numero];
		this.acao = (this.numero < this.fase.perguntas.length - 1) ? 'Próxima' : 'Concluir';

		if (this.selecionadas[this.numero]) {
			this.alternativaSelecionada = this.selecionadas[this.numero];
		} else {
			this.alternativaSelecionada = undefined;
		}
	}

	// Métodos para definir a classe css da alternativa quando a fase já foi concluida
	correta(alternativa: string): boolean {
		return (this.fase.faseFeita && alternativa == this.pergunta.correta)
	}

	selecionada(alternativa: string): boolean {
		return (this.fase.faseFeita && alternativa == this.selecionadas[this.numero])
	}

}
