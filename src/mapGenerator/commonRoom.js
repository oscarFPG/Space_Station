import Room from './room.js'

// Sala con enemigos 'normales' -> No minibosses, bosses, tienda, etc...
export default class CommonRoom extends Room {

    constructor(altura, anchura){
        super(altura, anchura, 'COMMON');
        this.id = 1;
    }
}