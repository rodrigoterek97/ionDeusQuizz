import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AutentProvider } from '../../providers/autent/autent';

@IonicPage()
@Component({
	selector: 'page-cadastro',
	templateUrl: 'cadastro.html',
})
export class CadastroPage {

	public form: FormGroup;

	constructor(
		public autentCtrl: AutentProvider,
		public formBld: FormBuilder,
		public loadingCtrl: LoadingController,
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController
	) {
		this.form = formBld.group({
			nick: '',
			email: '',
			password1: '',
			password2: ''
		})
	}

	cadastrar() {
		if (this.validar()) {
			let loading = this.loadingCtrl.create({
				spinner: 'crescent',
				content: 'Cadastrando...'
			})

			loading.present();

			this.autentCtrl
				.cadastrar(this.form.value.nick, this.form.value.email, this.form.value.password1)
				.then(() => {
					loading.dismiss();
					this.toast('Cadastro realizado com sucesso! :)');

					this.navCtrl.pop();
				})
				.catch(error => {
					loading.dismiss();

					let msg = (error == 'auth/email-already-in-use') ?
						'Nickname ou e-mail já em uso :(' : 'Erro ao realizar cadastro! :(';

					this.toast(msg);
				})

		} else {
			this.toast('Insira os dados corretamente!');
		}
	}

	private validar(): boolean {

		const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

		let isValido = regexp.test(this.form.value.email);

		if (this.form.value.password1 !== this.form.value.password2)
			isValido = false;

		return isValido;
	}

	private toast(msg: string) {
		this.toastCtrl.create({
			message: msg,
			duration: 2000
		}).present();
	}
}
