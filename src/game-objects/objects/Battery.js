import Builder from "../../managers/Builder.js";
import Object from "../base-game-objects/Object.js"


export default class Battery extends Object {
    
    constructor(scene, x, y) {
        super(scene, x, y, Builder.OBJ_BATERIA)
        this.body.setSize(30, 30)
        this.body.setOffset(0, 0)
        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0xffff00, 0.7);

        this._displayHelperText = true
        this._interactiveDistance = 110
        this.alreadyPulse = false
        this.setText("Pick up cell")
    }

    accion(player){

        if(!player.isUseKeyJustPressed())
			return

        this.removeLight()
        player.pickBattery()
        this.destroyObject()
    }

}