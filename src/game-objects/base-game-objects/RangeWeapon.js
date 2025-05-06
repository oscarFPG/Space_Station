import Weapon from './Weapon.js'
import Bullet from './Bullet.js';
import Options from '../../managers/Options.js';

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
        muzzleOffset: undefined, // Posicion relativa del cañon
        isEnemyWeapon:undefined,
        laserVision: undefined
    }

    _ammo = {
        type: undefined,              // Tipo de munición (pistola, escopeta, etc.)
        currentClipAmmo: undefined,   // Balas actualmente en el cargador
        clipSize: undefined,          // Tamaño del cargador
        reserveAmmo: undefined,       // Munición extra para recargar
        maxReserveAmmo: undefined     // Máximo de munición que puedes llevar
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
        if (this.#_isReloading) return
        console.log(`${this._specs.name} shooting`)

        if (this._ammo.currentClipAmmo <= 0)
            return

        const now = this.scene.time.now

        // Comprobar si puede volver a disparar(cadencia de disparo) y si tiene municion
        if (now - this._lastShotTime < (1 / this._specs.fireRate) * 1000 || this._ammo.currentClipAmmo <= 0)
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

    reload() {
        if (this.#_isReloading || this._ammo.currentClipAmmo === this._ammo.clipSize || this._ammo.reserveAmmo <= 0)
            return;
        const options = Options.get_instance();
        options.playSound(this.scene, 'reloading_gun', { isMusic: false, volume: 1.0 });
        this.#_isReloading = true;
    
        this.scene.time.delayedCall(this._specs.reloadTime * 1000, () => {
            if (!this._specs.isEnemyWeapon) {
                const needed = this._ammo.clipSize - this._ammo.currentClipAmmo
                const bulletsToLoad = Math.min(needed, this._ammo.reserveAmmo)
        
                this._ammo.currentClipAmmo += bulletsToLoad
                this._ammo.reserveAmmo -= bulletsToLoad
            } 
            else 
                this._ammo.currentClipAmmo = this._ammo.clipSize

                this.#_isReloading = false
        });

    }
    
    eliminateBulletFromClip(){
        this._ammo.currentClipAmmo--
    }

    getIsReloading(){
        return this.#_isReloading
    }

    getBulletsFromClip(){
        return this._ammo.currentClipAmmo
    }
    getBulletsFromReserve(){
        return this._ammo.reserveAmmo
    }
    getBulletsType() {
        return this._ammo.type
    }
    getClipSize() {
        return this._ammo.clipSize
    }
    getWeaponSprite() { 
        return this._specs.sprite
    }
    getReloadTime() {
        return this._specs.reloadTime
    }
    getLaserVision() {
        return this._specs.laserVision
    }
    setCurrentAmmo(ammo){
        this._ammo.currentClipAmmo = ammo
    }
    setReserveAmmo(ammo){
        this._ammo.reserveAmmo = ammo
    }
    boostAmmo(ammo){
        const newReserve = this._ammo.reserveAmmo + ammo
        if (newReserve > this._ammo.maxReserveAmmo)
            return false
        else {
            this._ammo.reserveAmmo = newReserve
            return true
        }
    }
}