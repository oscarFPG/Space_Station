import Object from "../base-game-objects/Object";


export default class Shield extends Object {

    static AUMENTO_ESCUDO = 5;
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite)
        this.body.setOffset(10, 10)
        this.body.setSize(30, 30)

    }

    player_overlaps(player){

        if(player.isFullShield())
            return

        player.shieldBoost(Shield.AUMENTO_ESCUDO);
        this.destroyObject()
    }

}