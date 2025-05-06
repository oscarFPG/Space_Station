import Phaser from "phaser";
import Object from "../base-game-objects/Object";
import Builder from "../../managers/Builder";
import Options from '../../managers/Options.js';


export default class AmmoBoxSniperBullet extends Object {

    static NUM_BULLETS = 5;
    static AMMO_WEAPON_NAME = 'sniper'

    constructor(scene, x, y) {
        super(scene, x, y, Builder.OBJ_AMMO_BOX_SNIPER, true)
        this.body.setSize(65, 65)
        this.body.setOffset(27, 27)
        
        this._displayHelperText = true
        this._interactiveDistance = 110
        this.setText("Pick up SNIPER AMMO")
        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0xDD2255, 0.7);
    }

    player_overlaps(player) {

        this._textoInteraccion.setVisible(true)
        this._textoInteraccion.setPosition(this.x + this._offsetX, this.y + this._offsetY)
        
        this.accion(player)
    }

    accion(player){

        if(!player.isUseKeyJustPressed())
            return       
        if (player.pickAmmo(AmmoBoxSniperBullet.AMMO_WEAPON_NAME, AmmoBoxSniperBullet.NUM_BULLETS)) {
            const options = Options.get_instance();
            options.playSound(this.scene, 'pick_up_ammo', { isMusic: false, volume: 1.0 });
            this.removeLight();
            this.destroyObject()
        }
    }
    getIsInteractive() { return true}

}
