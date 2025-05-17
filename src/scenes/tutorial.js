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
        super.create(map, tileset, 'Level1')

    }

    

}