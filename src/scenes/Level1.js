import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import Builder from '../managers/Builder.js'
import StoreObject from '../game-objects/objects/StoreObject.js'


export default class Level1 extends BaseScene {

    constructor(){
        super(Builder.ESCENA_NIVEL1)
    }


    create(){

        var map = this.make.tilemap({ key: Builder,MAP_LEVEL_1, tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('Tilemap2', 'tiles')
        super.create(map, tileset, 'Level2')

        this.laseresActivos = false
        this.laserTimer = this.time.addEvent({
            delay: 2000,
            callbackScope: this,
            callback: this.permutar_laseres,
            loop: true
        })

        const terminal = new StoreObject(this, 2440, 2560)

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