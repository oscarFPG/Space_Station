import Phaser from 'phaser'
import Builder from "../../managers/Builder";
import Object from '../base-game-objects/Object.js'
import Options from '../../managers/Options.js';

export default class Box extends Object {
    
    static VIDA_INICIAL = 10;

    constructor(scene, x, y) {
        super(scene, x, y, Builder.OBJ_CAJA, false);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false)
        this.body.setSize(60, 90);	
        this.body.setOffset(27,14);

        this._vida = Box.VIDA_INICIAL;
        
        this.#config_animacion('broken_box', Builder.OBJ_BOX_ANIMATION, 1, 4, 6);

        // Evento para detectar cuando termina la animación
        this.on('animationcomplete', (animation) => {
            if (animation.key === 'broken_box') {
                this.setFrame(4); 
            }
        });
    }

    quitarVida(cantidad){

	    this._vida -= cantidad
        this.setTintFill(0xffffff);
        this.scene.time.delayedCall(60, () => {
			this.clearTint();
		})

		if(this._vida <= 0) {
            this.destroyObject()
        }
    }

    destroyObject(){
        const options = Options.get_instance();
        options.playSound(this.scene, Builder.SOUND_BOX_BREAKING, { isMusic: false, volume: 1.0 });
        this.play('broken_box')
        this.body.checkCollision.none = true;
    }

    #config_animacion(animKey, animName, start, end, frameRate) {
        if (!this.scene.anims.exists(animKey)) {
            this.scene.anims.create({
                key: animKey,
                frames: this.scene.anims.generateFrameNumbers(animName, { start: start, end: end }),
                frameRate: frameRate,
                repeat: 0
            });
        }
    }
}
