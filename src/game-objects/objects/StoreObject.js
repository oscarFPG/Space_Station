import Phaser from 'phaser'
import Builder from '../../managers/Builder.js'
import Object from '../base-game-objects/Object.js'


export default class StoreObject extends Object {

    constructor(scene, x, y){
        super(scene, x, y, Builder.OBJ_TIENDA, true)
        
        this.setText('Abrir tienda')
    }


    accion(player){

        if(!player.isUseKeyJustPressed())
            return
    
        //  Pausar el juego
        this.scene.scene.pause(this.scene.key)

        // Lanzar la escena de tienda
        this.scene.scene.launch(Builder.ESCENA_TIENDA, { previousScene: this.scene.scene.key })
    }

}