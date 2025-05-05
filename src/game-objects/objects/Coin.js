import Builder from "../../managers/Builder";
import Object from '../base-game-objects/Object.js'
import Options from '../../managers/Options.js';


export default class Coin extends Object {

    static VELOCITY = 10
    static MINIMUM_DISTANCE_TO_PICKUP = 20
    static DEFAULT_VALUE = 15

    constructor(scene, x, y, value) {
        super(scene, x, y, Builder.OBJ_MONEDA, true)
        this.body.setSize(80, 80)
        this.body.setOffset(20, 20)
        this.value = (value == null) ? Coin.DEFAULT_VALUE : value
        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0xffffff, 0.7)
    }

    player_overlaps(player){
        
        player.receiveMoney(this.value)
        const options = Options.get_instance();
        options.playSound(this.scene, 'pick_up_coin', { isMusic: false, volume: 1.0 });
        this.removeLight();
        this.destroyObject()
    }
    getIsInteractive() { return true}
}