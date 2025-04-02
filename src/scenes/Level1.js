import Phaser from 'phaser'
import BaseScene from './BaseScene.js'


export default class Level1 extends BaseScene {

    constructor(){
        super('Level1')
    }


    create(){

        var map = this.make.tilemap({ key: 'map_level_1', tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('Tilemap2', 'tiles')
        super.create(map, tileset)
        //this._nextScene = 'Level2';

        this.laseresActivos = true
        this.laserTimer = this.time.addEvent({
            delay: 2000,
            callbackScope: this,
            callback: this.permutar_laseres,
            loop: true
        })
    }

    activar_laseres(){
        this.listaLaseres.forEach(laser => {
            laser.activate_laser()
        })
    }

    desactivar_laseres(){
        this.listaLaseres.forEach(laser => {
            if(laser.get_laser_ID() != 22)
                laser.disable_laser()
        })
    }

    permutar_laseres(){

        console.log('Permutar:' + !this.laseresActivos)
        this.laseresActivos = !this.laseresActivos
        if(this.laseresActivos)
            this.desactivar_laseres()
        else
            this.activar_laseres()
    }

}