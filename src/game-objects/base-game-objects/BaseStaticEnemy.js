import Phaser from 'phaser'
import WeaponFactory from '../../factories/WeaponFactory';

export default class BaseStaticEnemy extends Phaser.GameObjects.Sprite {

    static MAX_VIDA = undefined;

    _atributos = {
        vida: undefined,
        activo: undefined
    }
    _enemyParameters = {
        state: undefined,

        weapon: undefined,
        minDistance: undefined,
        visionRange: undefined,
        shootingRange: undefined,
        direction: {x: undefined, y: undefined},

        dodgeIntensity: undefined,
        lastDodgeSwitch: undefined,
        dodgeSwitchInterval: undefined,
        dodgeDirection: undefined
    };
    constructor(scene, x, y, sprite, vida){
        super(scene, x, y, sprite)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
        this.scene._charactersGroup.addElement(this)
        this.setDepth(10)
        
        this._atributos.vida = vida
        this._atributos.activo = true
    }
    quitarVida(cantidad){
        this._atributos.vida -= cantidad
        this.actualizar_color_efecto(this._atributos.vida / BaseActor.MAX_VIDA)

        if(this._atributos.vida <= 0)
            this.eliminar()
    }

    eliminar(){
        this.destroy(true)
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