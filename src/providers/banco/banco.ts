import { Injectable } from '@angular/core';
import { AngularFireDatabase, snapshotChanges } from 'angularfire2/database';
import { Reference } from '@firebase/database-types';

import { PerguntaModel } from './../../models/pergunta.model';

@Injectable()
export class BancoProvider {

	public user;
	private perguntasRef: Reference;
	private usuariosRef: Reference;

	constructor(public db: AngularFireDatabase) {

		this.perguntasRef = this.db.database.ref('perguntas');
		this.usuariosRef = this.db.database.ref('usuarios/');
	}

	definirUser(email: string): Promise<void> {
		return new Promise(resolve => {
			this.usuariosRef
				.once('value')
				.then(snapshot => {
					let usuarios = snapshot.val();

					for (const key in usuarios) {
						const usuario = usuarios[key];

						if (usuario.email == email) {
							this.user = usuario;
							resolve()
						}
					}
				})
		})
	}

	getPertuntas(): Promise<PerguntaModel[]> {
		return new Promise((resolve, reject) => {
			this.perguntasRef
				.once('value')
				.then(snapshot => {
					let data = snapshot.val();
					let perguntas: PerguntaModel[] = [];

					for (let perguntaKey in data) {
						let pergunta = data[perguntaKey];

						pergunta.id = perguntaKey;
						perguntas.push(pergunta);
					}

					if (perguntas.length > 0)
						resolve(perguntas);
					else
						reject(null);
				})
				.catch(error => {
					console.log(error);
					reject(null);
				})
		})
	}

	getUser(nick: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.usuariosRef
				.child(nick)
				.once('value')
				.then(snapshot => {
					let usuario = snapshot.val();

					if (usuario) {
						this.user = usuario;
						resolve(usuario)
					} else {
						reject('no-user-found')
					}

				})
				.catch(error => {
					reject(error)
				})
		})
	}

	getUsuarios(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.usuariosRef
				.once('value')
				.then(snapshot => {
					if (snapshot.val())
						resolve(snapshot.val());
					else
						reject();
				})
				.catch(() => {
					reject();
				})
		})
	}

	saveUsuario(nick: string, email: string) {
		this.db.database
			.ref('usuarios/' + nick)
			.set({
				nick: nick,
				email: email
			})
	}

	saveProgresso(area: string, update: any) {
		this.usuariosRef
			.child(this.user.nick)
			.child('progresso-' + area)
			.set(update)
			.then(() => {
				this.user['progresso-' + area] = update;
				console.log(this.user);
			})
	}

}
