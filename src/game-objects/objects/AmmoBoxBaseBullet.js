import Phaser from "phaser";
import Object from "../base-game-objects/Object";
import Builder from "../../managers/Builder";
import Options from '../../managers/Options.js';


export default class AmmoBoxBaseBullet extends Object {

    static NUM_BULLETS = 20;
    static AMMO_WEAPON_NAME = 'pistol'

    constructor(scene, x, y) {
        super(scene, x, y, Builder.OBJ_AMMO_BOX_BASE, true)
        this.body.setSize(65, 65)
        this.body.setOffset(27, 27)
        
        this._displayHelperText = true
        this._interactiveDistance = 110
        this.setText("Pick up PISTOL AMMO")
        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0x00DDDD, 0.7);
    }

    player_overlaps(player) {

        this._textoInteraccion.setVisible(true)
        this._textoInteraccion.setPosition(this.x + this._offsetX, this.y + this._offsetY)
        
        this.accion(player)
    }


    accion(player){

        if(!player.isUseKeyJustPressed())
            return       
        if (player.pickAmmo(AmmoBoxBaseBullet.AMMO_WEAPON_NAME, AmmoBoxBaseBullet.NUM_BULLETS)) {
            const options = Options.get_instance();
            options.playSound(this.scene, 'pick_up_ammo', { isMusic: false, volume: 1.0 });
            this.removeLight();
            this.destroyObject()
        }
    }
    getIsInteractive() { return true}

}
