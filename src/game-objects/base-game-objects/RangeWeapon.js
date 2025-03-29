import Weapon from './Weapon.js'
import Bullet from './Bullet.js';

export default class RangeWeapon extends Weapon {

    _specs = {
        damage: undefined,      // Daño del arma
        bulletSpeed: undefined, // Velocidad de la bala
        fireRate: undefined,    // Cadencia de disparo
        reloadTime: undefined,  // Tiempo de recarga(seg)
        weight: undefined,      // Peso del arma
        sprite: undefined,      // Sprite del arma
        canBounce: undefined,   // Bool para indicar si las balas rebotan
        canDrill: undefined,    // Bool para indicar si las balas penetrar objetivos
        muzzleOffset: undefined // Posicion relativa del cañon
    };

    _ammo = {
        currentClipAmmo: undefined, // Municion del cargador actual
        clipSize: undefined,        // Municion maxima de los cargadores
        ammoExtra: undefined,       // Municion de reserva
        texture: undefined          // Sprite de la bala
    };

    #_isReloading = false
    _lastShotTime = 0; // Guarda el tiempo del último disparo

    constructor(scene, x, y, texture){
        super(scene, x, y, texture)
        this.scene.add.existing(this);
    }

    shot(targetX, targetY) {

        if(this._ammo.currentClipAmmo <= 0)
            return

        const now = this.scene.time.now

        // Comprobar si puede volver a disparar(cadencia de disparo) y si tiene municion
        if(now - this._lastShotTime < (1 / this._specs.fireRate) * 1000 || this._ammo.currentClipAmmo <= 0)
            return

        this._lastShotTime = now
 
        // Obtener la posición mundial del arma
        const weaponX = this.parentContainer.x + this.x
        const weaponY = this.parentContainer.y + this.y

        // Calcular el ángulo de disparo
        const angle = Phaser.Math.Angle.Between(weaponX, weaponY, targetX, targetY)
        const bulletX = weaponX + Math.cos(angle) * this._specs.muzzleOffset
        const bulletY = weaponY + Math.sin(angle) * this._specs.muzzleOffset

        // Crear la bala en la posición del arma
        const bullet = new Bullet(this.scene, bulletX, bulletY, this._ammo.texture, this._specs.damage)
        this.scene.add.existing(bullet)
        this.scene._grupoBalas.add(bullet)
        bullet.fire(bulletX, bulletY, angle, this._specs.bulletSpeed)
        this._ammo.currentClipAmmo--
    }

    reload(){
        
        if(this.#_isReloading || this._ammo.currentClipAmmo == this._ammo.clipSize)
            return

        this.#_isReloading = true
        this.scene.time.delayedCall(this._specs.reloadTime * 1000, () => {
            var bulletsUsed = Math.abs(this._ammo.clipSize - this._ammo.currentClipAmmo)
            this._ammo.currentClipAmmo = this._ammo.clipSize
            this._ammo.ammoExtra -= bulletsUsed
            this.#_isReloading = false
        }, null)
    }

    getBulletsFromClip(){
        return this._ammo.currentClipAmmo
    }

    getMunicionReserva(){
        return this._ammo.ammoExtra
    }

}