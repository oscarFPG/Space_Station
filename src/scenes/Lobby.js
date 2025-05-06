import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import Builder from '../managers/Builder.js'


export default class Lobby extends BaseScene {

    constructor(){
        super(Builder.ESCENA_LOBBY)
    }

    create(){

        var map = this.make.tilemap({ key: 'map_lobby', tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('Tilemap2', 'tiles')
        super.create(map, tileset, 'tutorial')
        
        this.laseresActivos = false
    }

    activar_todos_los_laseres(){}
    desactivar_todos_los_laseres(){}
    permutar_laseres(){}
}