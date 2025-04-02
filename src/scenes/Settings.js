import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import Options from '../options-manager/Options.js'

export default class Settings extends BaseScene {

    constructor(){
        super('settings')
    }

    init(data){
        this._previousScene = data
    }

    create(){
        super.create()
        this.config_eventos()

        this.add.text(0, 0, 'PAUSA', { fontSize: '64px', color: '#FFFFFF' })
        .setOrigin(0.5)
        .setPosition(this.game.config.width / 2, this.game.config.height / 2)
    }

    update(time, delta){

    }

    config_eventos(){

        // Evento para volver a la escena anterior
        this.input.keyboard.on(Options.TECLA_PAUSA, () => {
            this.scene.switch(this._previousScene, null)
        }, this)
    }

}