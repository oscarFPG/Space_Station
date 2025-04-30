import Phaser from 'phaser'
import BaseScene from './BaseScene.js'


export default class Lobby extends BaseScene {

    constructor(){
        super('Lobby')
    }
    create(){

        var map = this.make.tilemap({ key: 'map_lobby', tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('Tilemap2', 'tiles')
        super.create(map, tileset, 'tutorial')
        //this._nextScene = 'Level2';
        this.laseresActivos = false
        this.laserTimer = this.time.addEvent({
            delay: 2000,
            callbackScope: this,
            callback: this.permutar_laseres,
            loop: true
        })
    }

    activar_todos_los_laseres(){
        this.listaLaseres.forEach(laser => {
            if(!laser.get_laser_isStatic())
                laser.activate_laser()
        })
    }

    desactivar_todos_los_laseres(){
        this.listaLaseres.forEach(laser => {
            if(!laser.get_laser_isStatic())
                laser.disable_laser()
        })
    }

    permutar_laseres(){

        this.laseresActivos = !this.laseresActivos
        if(this.laseresActivos)
            this.desactivar_todos_los_laseres()
        else
            this.activar_todos_los_laseres()
    }
}