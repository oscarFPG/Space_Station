import Room from './room.js'

// Sala en la que aparece el jugador
export default class InitialRoom extends Room {

    constructor(altura, anchura){
        super(altura, anchura, 'INITIAL');
        this.id = 0;
    }
}