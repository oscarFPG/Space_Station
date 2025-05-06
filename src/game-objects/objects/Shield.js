import Builder from "../../managers/Builder";
import Object from "../base-game-objects/Object";
import Options from '../../managers/Options.js';

export default class Shield extends Object {

    static AUMENTO_ESCUDO = 7.5;

    constructor(scene, x, y) {
        super(scene, x, y, Builder.OBJ_ESCUDO, true)
        this.body.setSize(65, 65)
        this.body.setOffset(27, 27)

        this._displayHelperText = true
        this._interactiveDistance = 110
        this.setText("Pick up shield")
        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0x0000ff, 0.7)
    }
    

    player_overlaps(player){

        this._textoInteraccion.setVisible(true)
		this._textoInteraccion.setPosition(this.x + this._offsetX, this.y + this._offsetY)
        
        if(player.isFullShield())
            return
        this.accion(player)
    }

    accion(player){

        if(!player.isUseKeyJustPressed())
			return
        const options = Options.get_instance();
        options.playSound(this.scene, 'pick_up_health', { isMusic: false, volume: 1.0 });
        this.removeLight()
        player.shieldBoost(Shield.AUMENTO_ESCUDO)
        this.destroyObject()
    }
    getIsInteractive() { return true}
}