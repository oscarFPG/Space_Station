import Object from "../base-game-objects/Object";


export default class Shield extends Object {

    static AUMENTO_ESCUDO = 5;
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite)
        this.body.setSize(80, 80)
        this.body.setOffset(20, 20)
        this._displayHelperText = true
        this._interactiveDistance = 110
        this.setText("Pick up shield")
    }
    configure() {
        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0x0000ff, 0.5);
    }

    player_overlaps(player){

        if(player.isFullShield())
            return

        this.accion(player)
    }

    accion(player){
        if(!player.isUseKeyJustPressed())
			return
        this.removeLight();
        player.shieldBoost(Shield.AUMENTO_ESCUDO);
        this.destroyObject()
    }

}