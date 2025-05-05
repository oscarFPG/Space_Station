import Phaser from "phaser";
import Object from "../base-game-objects/Object";
import Builder from "../../managers/Builder";


export default class Seller extends Object {

    static ACTIVATION_DISTANCE = 170

    constructor(scene, x, y) {
        super(scene, x, y, Builder.SELLER_IDLE_ANIMATION, true)
        this.body.setSize(65, 65)
        this.body.setOffset(27, 27)
        
        this._displayHelperText = true
        this._interactiveDistance = 110
        this.setText("Enter the console")
        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0xffffff, 0.25);
        this._player = this.scene.get_player()

        this.config_animacion('seller_idle', Builder.SELLER_IDLE_ANIMATION, 0, 3, 3);
        this.play('seller_idle'); 
    }

    accion(player){

        if(!player.isUseKeyJustPressed())
            return
        //INTRODUCIR LA LOGICA DE LA CONSOLA AQUI:
        
    }

    update() {
        // Detectar si el jugador está cerca del vendedor
        const distance = Phaser.Math.Distance.Between(
            this._player.x, this._player.y, this.x, this.y
        );
        if (distance < Seller.ACTIVATION_DISTANCE) 
            this.player_overlaps(this._player)
        else 
            this.player_end_overlaps(this._player)
    }

    config_animacion(animKey, animName, start, end, frameRate){

        if (!this.scene.anims.exists(animKey)) {
			var ok = this.scene.anims.create({
				key: animKey,
				frames: this.scene.anims.generateFrameNumbers(animName, { start: start, end: end }),
				frameRate: frameRate,
				repeat: -1
			});
    	}
    }
    getIsInteractive() { return true}
}
