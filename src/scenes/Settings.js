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
        super.create(null, null, null)
    }

    update(){
        
    }

    config_eventos(){

        // Evento para volver a la escena anterior
        this.input.keyboard.on(Options.TECLA_PAUSA, () => {
            this.scene.switch(this._previousScene, null)
        }, this)
    }

}