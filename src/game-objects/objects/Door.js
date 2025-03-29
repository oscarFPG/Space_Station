import Phaser from 'phaser'
import Object from '../base-game-objects/Object'

export default class Door extends Object {

    static OPEN_ANIMATION = 'doorsAnimation'

    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite)
        this.body.setSize(60, 180)
        this.body.setOffset(27, -40)
        this.body.setImmovable(true)
        this.body.setAllowGravity(false)

        this._isActive = true

        // Frame inicial de la puerta (cerrada)
        this.setFrame(0)

        this.#config_animacion('open_doors', Door.OPEN_ANIMATION, 0, 4, 8)
        this.#config_animacion('close_doors', Door.OPEN_ANIMATION, 4, 0, 8)

        // Estado inicial
        this._isPlayerNearby = false // Para evitar múltiples reproducciones de animación
    }

    preUpdate(tim, delta){

        const player = this.scene.get_player()
        if(!this._isActive || !player)
            return


        const distance = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y)
        if (distance < 200) { // Ajusta el rango según sea necesario
            if (!this._isPlayerNearby) {
                this._isPlayerNearby = true 
                this.abrirPuerta()
                this.body.checkCollision.none = true
            }
        } else {
            if (this._isPlayerNearby) {
                this._isPlayerNearby = false 
                this.cerrarPuerta()
                this.body.checkCollision.none = false
            }
        }
    }

    player_overlaps(player){}

    accion(){}

    abrirPuerta() {

        this.play('open_doors') 
        this.scene.time.delayedCall(800, () => {
            this.setFrame(4) 
        })
    }

    cerrarPuerta() {

        this.play('close_doors') 
        this.scene.time.delayedCall(800, () => {
            this.setFrame(0) 
        })
    }

    #config_animacion(animKey, animName, start, end, frameRate) {

        if (!this.scene.anims.exists(animKey)) {
            this.scene.anims.create({
                key: animKey,
                frames: this.scene.anims.generateFrameNumbers(animName, { start: start, end: end }),
                frameRate: frameRate,
                repeat: 0
            })
        }
    }
}
