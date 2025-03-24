import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import ExtendedEnemy from '../game-objects/characters/ExtendedEnemy.js'
import Player from '../game-objects/characters/Player.js'
import Coin from '../game-objects/objects/Coin.js'


export default class Tutorial extends BaseScene {

    constructor(){
        super('tutorial')
    }

    create(){

        var map = this.make.tilemap({ key: 'map_tutorial', tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('Tilemap2', 'tiles')

        super.create(map, tileset)

        //const moneda = new Coin(this, 850, 1000)
    }

    update(time, deltaTime){
        
    }

    config_enemigos(){

        var enemigos = []
        var unEnemigo = new ExtendedEnemy(this, 1500, 1500)
        unEnemigo.body.setCollideWorldBounds(true)
        unEnemigo.body.setImmovable(true)

        enemigos.push(unEnemigo)

        return enemigos
    }

    config_jugador(){
        return new Player(this, 350, 450)
    }
    
}