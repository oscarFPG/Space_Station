import Phaser from 'phaser'
import Player from '../game-objects/characters/Player.js'


export default class BaseScene extends Phaser.Scene {

    constructor(sceneKey){
        super({ key: sceneKey })
    }


    // IMPORTANTE - cualquier escena que herede de esta clase debe invocar 
    // SIEMPRE esta funcion con super.create() y SIEMPRE AL PRINCIPIO
    // NO cambiar el orden
    create(){

        this._mapa = this.config_mapa()
        this._jugador = this.config_jugador()
        this._enemigos = this.config_enemigos()
        this._camara = this.config_camara()
        this.config_iluminacion()
        this.config_eventos()
    }

    config_mapa(){

    }

    config_jugador(){

    }

    config_enemigos(){

        enemigos = []

        return enemigos
    }

    config_camara(){

    }

    config_iluminacion(){

    }

    config_eventos(){

    }

}