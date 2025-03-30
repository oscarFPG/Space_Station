import Object from "../base-game-objects/Object";


export default class Shield extends Object {

    static AUMENTO_ESCUDO = 5;
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite)
        this.body.setSize(80, 80)
        this.body.setOffset(20, 20)

    }

    player_overlaps(player){

        if(player.isFullShield())
            return

        this.accion(player)
    }

    accion(player){
        player.shieldBoost(Shield.AUMENTO_ESCUDO);
        this.destroyObject()
    }

}