
export default class Room {

    static POSICION = Object.freeze({
        NORTE: 0,
        ESTE: 1,
        SUR: 2,
        OESTE: 3
    })

    static MAX_PUERTAS = 4; // Una en cada pared

    constructor(altura, anchura, tipo){
        this._alto = altura;
        this._ancho = anchura;
        this._tipo = tipo;
        this._puertas = [];
    }

    colocarPuerta(pos){
        
        switch(pos){
        case Room.POSICION.NORTE:
            this._puertas[Room.POSICION.NORTE] = pos;
            break;

        case Room.POSICION.ESTE:
            this._puertas[Room.POSICION.ESTE] = pos;
            break;

        case Room.POSICION.SUR:
            this._puertas[Room.POSICION.SUR] = pos;
            break;

        case Room.POSICION.OESTE:
            this._puertas[Room.POSICION.OESTE] = pos;
            break;

        default:
            throw new Error(`Orientacion de puerta ${pos} no reconocido`);
        }
    }

}