import Phaser from 'phaser'
import Object from '../base-game-objects/Object.js'
import WeaponFactory from '../../factories/WeaponFactory.js'
import Options from '../../managers/Options.js';


export default class WeaponObject extends Object {

    constructor(scene, x, y, weaponTexture, currentAmmo, reserveAmmo){
        super(scene, x, y, weaponTexture, true)

        this._texturaArma = weaponTexture
        this._arma = WeaponFactory.crearArma(weaponTexture, scene, {x: 0, y: 0})
        this._currentAmmo = currentAmmo
		this._reserveAmmo = reserveAmmo
        this.setText(`Pick up ${this._arma._specs.name}`)
        this._arma.destroy()
    }

    accion(player){
        
        if(!player.isUseKeyJustPressed())
            return
        if (!player.getIsActiveSecondaryWeapon())
            player.recogerArma(this._texturaArma, this._currentAmmo, this._reserveAmmo)
        else 
            player.intercambiarArma(this.x, this.y, this._texturaArma, this._currentAmmo, this._reserveAmmo)
        const options = Options.get_instance();
        options.playSound(this.scene, 'pick_up_gun', { isMusic: false, volume: 1.0 });
        this.destroyObject()
    }

    setCurrentAmmo(ammo) {
        this._arma.setCurrentAmmo(ammo)
    }

    setReserveAmmo(ammo) {
        this._arma.setReserveAmmo(ammo)
    }

    destroyObject(){
    
        this._textoInteraccion.destroy()
        this.destroy()
    }
    getIsInteractive() { return true}
}