import { Injectable } from '@angular/core';

import { BancoProvider } from './../banco/banco';

import { AreaModel } from '../../models/area.model';
import { FaseModel } from '../../models/fase.model';
import { PerguntaModel } from './../../models/pergunta.model';

@Injectable()
export class GeradorProvider {

	public areas: AreaModel[];

	constructor(
		public bancoCtrl: BancoProvider
	) {
		this.areas = [];
	}

	getAreas(): Promise<AreaModel[]> {

		return new Promise((resolve, reject) => {

			this.getPerguntas()
				.then(perguntasPorArea => {

					let areas: AreaModel[] = [];

					for (let area in perguntasPorArea) {
						let perguntas = perguntasPorArea[area];

						let fases = this.getFases(perguntas);

						if (fases.length > 0) {
							areas.push({
								nome: area,
								fases: fases
							})
						}
					}

					this.areas = areas;

					resolve(areas);
				})
				.catch(() => {
					reject(null);
				})
		})
	}

	getRanking(): Promise<any> {
		return new Promise((resolve, reject) => {

			this.bancoCtrl.getUsuarios()
				.then(usuarios => {

					let ranking = [];

					for (let nick in usuarios) {
						let usuario = usuarios[nick];
						let rkn = {};

						rkn['nick'] = nick;

						this.areas.forEach(area => {

							rkn[area.nome] = 0;

							area.fases.forEach(fase => {

								if (usuario['progresso-' + area.nome])
									if (usuario['progresso-' + area.nome][fase.id])
										fase.perguntas.forEach((pergunta, index) => {
											if (pergunta.correta == usuario['progresso-' + area.nome][fase.id][index])
												rkn[area.nome]++;
										})

							})

						})

						ranking.push(rkn);

					}

					resolve(ranking);
				})
				.catch(() => {
					reject();
				})

		})
	}

	private getPerguntas(): Promise<any> {
		return new Promise((resolve, reject) => {

			this.bancoCtrl.getPertuntas()
				.then(perguntas => {

					let areas = [];
					let retorno = {};

					perguntas.forEach(pergunta => {
						if (areas.indexOf(pergunta.area) == -1)
							areas.push(pergunta.area);
					})

					areas.forEach(area => {
						retorno[area] = perguntas
							.filter(pergunta => { return (pergunta.area == area) });
					})

					console.log(retorno);
					resolve(retorno);
				})
				.catch(() => {
					reject(null);
				})
		})
	}

	private getFases(perguntas: PerguntaModel[]): FaseModel[] {

		let fases: FaseModel[] = [];
		let qtd = Math.floor(perguntas.length / 10);
		let j = 10;

		for (let index = 0; index < qtd; index++) {

			fases.push({
				id: index,
				area: perguntas[0].area,
				perguntas: perguntas.slice((index * 10), j),
				requerimento: (index == 0) ? null : [{
					id: (index - 1),
					area: perguntas[0].area
				}]
			})

			j += 10;
		}

		return fases;
	}

}
