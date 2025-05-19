import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import Builder from '../managers/Builder.js'

export default class Tutorial extends BaseScene {

    constructor(){
        super(Builder.ESCENA_TUTORIAL)
    }

    create(){

        var map = this.make.tilemap({ key: Builder.MAP_TUTORIAL, tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('Tilemap2', Builder.TILES)
        super.create(map, tileset, Builder.ESCENA_NIVEL1)
    }

    gameOver() {
    
        this.ambient = this.sound.add(Builder.SOUND_DEAD_PLAYER) 
        this.ambient.setVolume(0.5)
        this.ambient.play()
        
        this.cameras.main.fadeOut(500, 0, 0, 0);
    
        this.time.delayedCall(400, () => {
            this.scene.restart()    
        })
    }

}