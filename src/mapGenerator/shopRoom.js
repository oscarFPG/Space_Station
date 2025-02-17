import Room from './room.js'

export default class ShopRoom extends Room {

    constructor(altura, anchura){
        super(altura, anchura, 'SHOP');
        this.id = 2;
    }
}