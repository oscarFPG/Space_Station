import Phaser from 'phaser'
import Player from '../game-objects/characters/Player.js'


export default class BaseScene extends Phaser.Scene {

    constructor(sceneKey){
        super({ key: sceneKey })
    }


    // IMPORTANTE - cualquier escena que herede de esta clase debe invocar 
    // SIEMPRE esta funcion con super.create() y SIEMPRE AL PRINCIPIO
    // NO cambiar el orden
    create(){

        this.config_cursor()

        var map = this.createMap()
        var player = this.createPlayer(200, 200)

    }

    createMap(){

        var map = this.make.tilemap({ key: 'map', tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('tilemap', 'tiles')
        var layerFloor = map.createLayer('floor', tileset, 0, 0)
        var layerWall = map.createLayer('wall', tileset, 0, 0)
        var layerButano = map.createLayer('butano', tileset, 0, 0)
        var layerExtra = map.createLayer('extra', tileset, 0, 0)
        var objectsLayer = map.getObjectLayer('objects')
        
        return map
    }


    createPlayer(x, y){
        return new Player(this, x, y)
    }

    config_cursor(){
        this.input.setDefaultCursor('crosshair')
    }
}