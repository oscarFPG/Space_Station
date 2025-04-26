import Phaser from 'phaser'
import Object from '../base-game-objects/Object.js'
import WeaponFactory from '../../factories/WeaponFactory.js'


export default class WeaponObject extends Object {

    constructor(scene, x, y, weaponTexture){
        super(scene, x, y, weaponTexture)

        this._texturaArma = weaponTexture
        this._arma = WeaponFactory.crearArma(weaponTexture, scene, {x: 0, y: 0})
        this.setText(`Pick up ${this._arma._specs.name}`)

        this._arma.destroy()
    }

    accion(player){
        
        if(!player.isUseKeyJustPressed())
            return

        player.recogerArma(this._texturaArma)
        this.destroyObject()
    }

    destroyObject(){
    
        this._textoInteraccion.destroy()
        this.destroy()
    }

}