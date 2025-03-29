import Phaser from "phaser";
import Object from "../base-game-objects/Object";


export default class Health extends Object {

    static AUMENTO_VIDA = 5;

    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
    }


    player_overlaps(player) {

        if(player.isFullHealth())
            return

        player.healthBoost(Health.AUMENTO_VIDA);
        this.destroyObject()
    }

}
