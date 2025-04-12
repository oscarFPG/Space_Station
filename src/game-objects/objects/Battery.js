import Object from "../base-game-objects/Object.js"


export default class Battery extends Object {
    
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite)
        this.body.setSize(80, 80)
        this.body.setOffset(20, 20)
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