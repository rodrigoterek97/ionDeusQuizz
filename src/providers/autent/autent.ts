import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';

import { BancoProvider } from './../banco/banco';

@Injectable()
export class AutentProvider {

	constructor(
		public authCtrl: AngularFireAuth,
		public bancoCtrl: BancoProvider
	) { }

	cadastrar(nick: string, email: string, password: string): Promise<any> {
		return new Promise((resolve, reject) => {
			nick = nick.toLowerCase();
			this.bancoCtrl.getUser(nick)
				.then(() => {
					reject('auth/email-already-in-use');
				})
				.catch(error => {
					if (error == 'no-user-found') {

						this.authCtrl.auth
							.createUserWithEmailAndPassword(email, password)
							.then(() => {
								this.bancoCtrl.saveUsuario(nick, email);
								resolve();
							})
							.catch(error => {
								reject(error.code);
							})

					} else {
						reject();
					}
				})
		})

	}

	login(nick: string, password: string): Promise<any> {
		nick = nick.toLowerCase();
		return new Promise((resolve, reject) => {
			this.bancoCtrl.getUser(nick)
				.then(user => {
					this.authCtrl.auth
						.signInWithEmailAndPassword(user.email, password)
						.then(() => {
							resolve()
						})
						.catch(error => {
							reject(error)
						})
				})
				.catch(error => {
					reject(error);
				})
		})
	}

	logout(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.authCtrl.auth.signOut()
				.then(() => {
					resolve();
				})
				.catch(() => {
					reject();
				})
		})
	}

	isLogged(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			let unsubscribe = this.authCtrl.auth
				.onAuthStateChanged(user => {
					if (user) {
						this.bancoCtrl.definirUser(user.email)
							.then(() => {
								unsubscribe();
								resolve(true);
							})
					} else {
						unsubscribe();
						resolve(false);
					}
				})
		})
	}

}
