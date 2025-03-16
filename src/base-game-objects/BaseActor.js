import Phaser from 'phaser'

export default class BaseActor extends Phaser.GameObjects.Container {

    static MAX_VIDA = undefined;

    _atributos = {
        vida: undefined,
        speed: undefined
    }

    constructor(scene, x, y, sprite, vida, speed){
        super(scene, x, y)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        this._sprite = this.scene.add.sprite(sprite.x, sprite.y, sprite.texture)
        this.add(this._sprite)

        BaseActor.MAX_VIDA = vida
        this._atributos.vida = vida
        this._atributos.speed = speed
    }

    aumentarVida(cantidad){
        this._atributos.vida += cantidad
    }

    quitarVida(cantidad){
        this._atributos.vida -= cantidad
        this.actualizar_color_efecto(this._atributos.vida / Player.VIDA_INICIAL)
    }

    actualizar_color_efecto(porcentaje){

        if(0.5 <= porcentaje){
			this._sprite.setTintFill(0xffffff)	// Blanco
        }
        else if(0.25 < porcentaje && porcentaje < 0.5){
			this._sprite.setTintFill(0xffe715)	// Amarillo
        }
        else{
			this._sprite.setTintFill(0xff2020)	// Rojo
        }

        this.scene.time.delayedCall(80, () => {
			this._sprite.clearTint();
		});
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

}