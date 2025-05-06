import Builder from "../../managers/Builder.js";
import Object from "../base-game-objects/Object.js"
import Options from '../../managers/Options.js';


export default class Battery extends Object {
    
    constructor(scene, x, y) {
        super(scene, x, y, Builder.OBJ_BATERIA, true)
        this.body.setSize(65, 65)
        this.body.setOffset(27, 27)
        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0xffff00, 0.7);

        this._displayHelperText = true
        this._interactiveDistance = 110
        this.alreadyPulse = false
        this.setText("Pick up cell")
    }



    accion(player){
        
        if(!player.isUseKeyJustPressed())
			return
        const options = Options.get_instance();
        options.playSound(this.scene, 'pick_up_battery', { isMusic: false, volume: 1.0 });
        this.removeLight()
        player.pickBattery()
        this.destroyObject()
    }
    getIsInteractive() { return true}

}