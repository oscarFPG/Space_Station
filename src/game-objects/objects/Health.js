import Phaser from "phaser";
import Object from "../base-game-objects/Object";


export default class Health extends Object {

    static AUMENTO_VIDA = 5;

    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite)
        this.body.setSize(80, 80)
        this.body.setOffset(20, 20)
        this._displayHelperText = true
        this._interactiveDistance = 110
        this.setText("Pick up healthKit")
    }
    configure() {
        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0xffff00, 0.5);
    }
    player_overlaps(player) {
        if(player.isFullHealth())
            return
        
        this.accion(player)
    }



    accion(player){
        if(!player.isUseKeyJustPressed())
			return
        this.removeLight();
        player.healthBoost(Health.AUMENTO_VIDA)
        this.destroyObject()
    }

}
