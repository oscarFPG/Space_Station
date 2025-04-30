import Phaser from "phaser";
import Object from "../base-game-objects/Object";
import Builder from "../../managers/Builder";


export default class AmmoBoxBaseBullet extends Object {

    static Cargador = 25;

    constructor(scene, x, y) {
        super(scene, x, y, Builder.OBJ_AMMO_BOX_BASE)
        this.body.setSize(65, 65)
        this.body.setOffset(27, 27)
        
        this._displayHelperText = true
        this._interactiveDistance = 110
        this.setText("Pick up PISTOL AMMO")
        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0xFFFFFF, 0.7);
    }

    player_overlaps(player) {

        this._textoInteraccion.setVisible(true)
        this._textoInteraccion.setPosition(this.x + this._offsetX, this.y + this._offsetY)

        if(player.isFullHealth())
            return
        
        this.accion(player)
    }


    accion(player){

        if(!player.isUseKeyJustPressed())
            return
        
        this.removeLight();
        //player.healthBoost(Health.AUMENTO_VIDA)
        this.destroyObject()
    }

}
