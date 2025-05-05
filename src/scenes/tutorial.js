import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import StoreObject from '../game-objects/objects/StoreObject.js'


export default class Tutorial extends BaseScene {

    constructor(){
        super('tutorial')
    }

    create(){

        var map = this.make.tilemap({ key: 'map_tutorial', tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('Tilemap2', 'tiles')
        super.create(map, tileset, 'Level1')

        const tienda = new StoreObject(this, 500, 500)

    }

    

}