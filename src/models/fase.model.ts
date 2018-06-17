import { PerguntaModel } from "./pergunta.model";

export class FaseModel {

    public id: number;
    public area: string;
    public perguntas: PerguntaModel[];
    public requerimento?: Requerimento[];
    public faseFeita?: boolean;
    public faseDisp?: boolean;

    constructor(
    ) { }

}

class Requerimento {
    public id: number;
    public area: string;
}