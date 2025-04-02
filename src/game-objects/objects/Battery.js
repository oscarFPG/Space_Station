import Object from "../base-game-objects/Object.js"


export default class Battery extends Object {
    
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite)
        this.body.setSize(80, 80)
        this.body.setOffset(20, 20)
    }

    accion(player){
        console.log('Bateria cogida')
        player.pickBattery()
        this.destroyObject()
    }

}