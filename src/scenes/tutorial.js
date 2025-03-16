import Phaser from 'phaser'
import BaseScene from './base-scene.js'


export default class Tutorial extends BaseScene {

    constructor(){
        Tutorial.KEY = 'tutorial'
        super(Tutorial.KEY)
    }

    create(){

        var map = this.make.tilemap({ key: 'map', tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('tilemap', 'tiles')

        super.create(map, tileset)
    }

    onLaserHit(player, laser) {
        player.receiveDamage(200);
    }

    update(time, deltaTime){
        
    }
}