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
        this._enemigos = []
        this._nextScene = 'Level1';
        super.create(map, tileset)
        this.createMushroom(map)
    }
    config_enemigos(x, y){
        var unEnemigo = new ExtendedEnemy(this, x, y)
        unEnemigo.body.setCollideWorldBounds(true)
        unEnemigo.body.setImmovable(true)
        this._enemigos.push(unEnemigo)
    }
}