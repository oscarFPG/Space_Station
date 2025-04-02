import Phaser from "phaser";
import Object from "../base-game-objects/Object";


export default class Health extends Object {

    static AUMENTO_VIDA = 5;

    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite)
        this.body.setSize(80, 80)
        this.body.setOffset(20, 20)
    }


    player_overlaps(player) {

        if(player.isFullHealth())
            return

        this.accion(player)
    }

    accion(player){
        player.healthBoost(Health.AUMENTO_VIDA)
        this.destroyObject()
    }

}
