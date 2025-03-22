import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import ExtendedEnemy from '../game-objects/characters/ExtendedEnemy.js'
import Coin from '../game-objects/objects/Coin.js'


export default class Tutorial extends BaseScene {

    constructor(){
        super('tutorial')
    }

    create(){

        var map = this.make.tilemap({ key: 'map', tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('tilemap', 'tiles')

        super.create(map, tileset)

        const moneda = new Coin(this, 850, 1000)
    }

    config_enemigos(){

        var enemigos = []
        var unEnemigo = new ExtendedEnemy(this, 1500, 1500)
        unEnemigo.body.setCollideWorldBounds(true)
        unEnemigo.body.setImmovable(true)

        enemigos.push(unEnemigo)

        return enemigos
    }

    update(time, deltaTime){
        
    }
}