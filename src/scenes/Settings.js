import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import Options from '../options-manager/Options.js'

export default class Settings extends BaseScene {

    constructor(){
        super('settings')
    }

    init(data){
        this.previous_scene = data
    }

    create(){

        // Evento para volver a la escena anterior
        this.input.keyboard.on(Options.TECLA, () => {
            this.scene.stop()
            this.scene.start('tutorial', this.previous_scene)
        }, this)
    }

    update(){
        
    }
}