
// Use as abtracts class 
// ¡¡¡¡ DO NOT IMPORT OR INSTANCIATE !!!!
export default class Room {

    id;
    alto;
    ancho;
    tipoSala;

    constructor(altura, anchura, tipo){
        this.alto = altura;
        this.ancho = anchura;
        this.tipoSala = tipo;
    }

}