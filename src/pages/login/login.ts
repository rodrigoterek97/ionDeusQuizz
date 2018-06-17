import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';

import { TabsPage } from '../tabs/tabs';
import { CadastroPage } from './../cadastro/cadastro';
import { AutentProvider } from '../../providers/autent/autent';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	public form: FormGroup;
	public cadastro = CadastroPage;

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
			password: ''
		});
	}

	login() {
		let loading = this.loadingCtrl.create({
			spinner: 'crescent',
			content: 'Entrando...'
		})

		loading.present();

		this.autentCtrl
			.login(this.form.value.nick, this.form.value.password)
			.then(() => {
				this.navCtrl.setRoot(TabsPage)
					.then(() => { loading.dismiss() })
			})
			.catch(error => {
				loading.dismiss();
				console.error(error);
				this.toastCtrl.create({
					message: 'Nickname ou senha inválidos! :(',
					duration: 20000
				}).present();
			})

	}
}
