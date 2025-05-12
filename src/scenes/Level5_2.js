import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import Builder from '../managers/Builder.js'

export default class Level5_2 extends BaseScene {

    constructor(){
        super(Builder.ESCENA_NIVEL5_2)
    }
    create(){

        var map = this.make.tilemap({ key: Builder.MAP_LEVEL_5_2, tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('Tilemap2', Builder.TILES)
        super.create(map, tileset, 'creditsScene')
        this.laseresActivos = false
        this.laserTimer = this.time.addEvent({
            delay: 2200,
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