import Phaser from 'phaser'
import Object from '../base-game-objects/Object'

export default class Door extends Object {

    static TEXTURE = 'door'
    static OPEN_ANIMATION = 'doorsAnimation'
    static OPENING_TIME = 100
    static CLOSING_TIME = 100

    constructor(scene, x, y, active, doorID) {
        super(scene, x, y, Door.TEXTURE)
        this.body.setSize(110, 110)
        this.body.setOffset(0, 0)
        this.body.setImmovable(true)
        this.body.setAllowGravity(false)

        this._doorID = doorID
        this._isActive = active

        // Frame inicial de la puerta (cerrada)
        this.setFrame(0)

        this.#config_animacion('open_doors', Door.OPEN_ANIMATION, 0, 4, 8)
        this.#config_animacion('close_doors', Door.OPEN_ANIMATION, 4, 0, 8)

        // Estado inicial
        this._isPlayerNearby = false // Para evitar múltiples reproducciones de animación
    }

    preUpdate(time, delta){

        const player = this.scene.get_player()
        if(!player)
            return

        // Abrir de forma automatica si esta activada
        if(!this._isActive)
            return

        const distance = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y)
        if (distance < 200) {
            this.body.checkCollision.none = true
            this.abrirPuerta()
        }
        else {
            this.body.checkCollision.none = false
            this.cerrarPuerta()
        }
    }

    abrirPuerta() {

        this.play('open_doors', true) 
        this.scene.time.delayedCall(Door.OPENING_TIME, () => {
            this.setFrame(4) 
        })
    }

    cerrarPuerta() {

        this.play('close_doors', true) 
        this.scene.time.delayedCall(Door.CLOSING_TIME, () => {
            this.setFrame(0) 
        })
    }

    set_active(status){
        this._isActive = status
        console.log('Puerta activada')
    }
    getID(){
        return this._doorID
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
