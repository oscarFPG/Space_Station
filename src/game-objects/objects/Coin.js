import Builder from "../../managers/Builder";
import Object from '../base-game-objects/Object.js'


export default class Coin extends Object {

    static VELOCITY = 10
    static MINIMUM_DISTANCE_TO_PICKUP = 20

    constructor(scene, x, y, value) {
        super(scene, x, y, Builder.OBJ_MONEDA)
        this.body.setSize(80, 80)
        this.body.setOffset(20, 20)
        this.value = value
        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0xffffff, 0.7)
    }

    player_overlaps(player){
        
        player.receiveMoney(this.value)
        this.removeLight();
        this.destroyObject()
    }

}