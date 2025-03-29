import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import ExtendedEnemy from '../game-objects/characters/ExtendedEnemy.js'


export default class Tutorial extends BaseScene {

    constructor(){
        super('tutorial')
    }

    create(){

        var map = this.make.tilemap({ key: 'map_tutorial', tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('Tilemap2', 'tiles')
        super.create(map, tileset, 'Level1')

    }

    config_enemigos(x, y){

        var enemigos =  []

        const enemy = new ExtendedEnemy(this, x, y)
        enemy.body.setCollideWorldBounds(true)
        enemy.body.setImmovable(true)

        enemigos.push(enemy)

        return enemigos
    }
}