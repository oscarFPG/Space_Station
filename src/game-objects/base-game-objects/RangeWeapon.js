import Weapon from './Weapon.js'
import Bullet from './Bullet.js';

export default class RangeWeapon extends Weapon {

    _specs = {
        name: undefined,        // Nombre del arma
        damage: undefined,      // Daño del arma
        bulletSpeed: undefined, // Velocidad de la bala
        fireRate: undefined,    // Cadencia de disparo
        reloadTime: undefined,  // Tiempo de recarga(seg)
        weight: undefined,      // Peso del arma
        sprite: undefined,      // Sprite del arma
        canBounce: undefined,   // Bool para indicar si las balas rebotan
        canDrill: undefined,    // Bool para indicar si las balas penetrar objetivos
        muzzleOffset: undefined // Posicion relativa del cañon
    }

    _ammo = {
        type: undefined,            // Tipo de municion: 'pistola', 'subfusil', 'fusil', 'escopeta', 'sniper'
        currentClipAmmo: undefined, // Municion del cargador actual
        clipSize: undefined         // Municion maxima de los cargadores
    }

    #_isReloading = false
    _lastShotTime = 0; // Guarda el tiempo del último disparo

    constructor(scene, x, y, texture, color){
        super(scene, x, y, texture)
        this.colorLightBullet = color;
    }

    createBullet(){
        throw new Error('El metodo `createBullet` debe sobreescribirse para disparar proyectiles')
    }

    shot(targetX, targetY) {

        console.log(`${this._specs.name} shooting`)

        if(this._ammo.currentClipAmmo <= 0)
            return

        const now = this.scene.time.now

        // Comprobar si puede volver a disparar(cadencia de disparo) y si tiene municion
        if(now - this._lastShotTime < (1 / this._specs.fireRate) * 1000 || this._ammo.currentClipAmmo <= 0)
            return

        this._lastShotTime = now
 
        // Obtener la posición mundial del arma
        var weaponX = this.x
        var weaponY = this.y
        if (this.parentContainer) {
            weaponX += this.parentContainer.x 
            weaponY += this.parentContainer.y
        } 

        // Calcular el ángulo de disparo
        const angle = Phaser.Math.Angle.Between(weaponX, weaponY, targetX, targetY)
        const bulletX = weaponX + Math.cos(angle) * this._specs.muzzleOffset
        const bulletY = weaponY + Math.sin(angle) * this._specs.muzzleOffset

        // Crear la bala en la posición del arma
        const bullet = this.createBullet(bulletX, bulletY);
        this.scene.add.existing(bullet)
        this.scene._grupoBalas.add(bullet)
        bullet.fire(bulletX, bulletY, angle, this._specs.bulletSpeed)
        this.eliminateBulletFromClip()    
    }

    reload(){
        
        if(this.#_isReloading || this._ammo.currentClipAmmo == this._ammo.clipSize)
            return

        this.#_isReloading = true
        this.scene.time.delayedCall(this._specs.reloadTime * 1000, () => {
            var bulletsUsed = Math.abs(this._ammo.clipSize - this._ammo.currentClipAmmo)
            this._ammo.currentClipAmmo = this._ammo.clipSize
            this.#_isReloading = false
        }, null)
    }

    eliminateBulletFromClip(){
        this._ammo.currentClipAmmo--
    }

    getBulletsFromClip(){
        return this._ammo.currentClipAmmo
    }
    setAmmo(ammo){
        this._ammo.currentClipAmmo = ammo
    }

}