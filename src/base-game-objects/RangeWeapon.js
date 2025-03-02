import Weapon from './Weapon'
import BasePistolBullet from '../game-objects/bullets/BasePistolBullet';

export default class RangeWeapon extends Weapon {

    _specs = {
        bulletSpeed: undefined,
        fireRate: undefined,    
        reloadTime: undefined, 
        weight: undefined,
        sprite: undefined,
        canBounce: undefined,  
        canDrill: undefined,   
        muzzleOffset: undefined 
    };

    _ammo = {
        clipSize: undefined,        
        currentClipAmmo: undefined, 
        numClips: undefined        
    };

    _lastShotTime = 0; // Guarda el tiempo del último disparo

    constructor(scene, x, y, texture, damage){
        super(scene, x, y, texture, damage)
        this.scene.add.existing(this);
    }

    shot(targetX, targetY) {

        const now = this.scene.time.now;

        // Comprobar si puede volver a disparar(cadencia de disparo) y si tiene municion
        if(now - this._lastShotTime < this._specs.fireRate * 1000 || this._ammo.currentClipAmmo <= 0)
            return;

        
        this._lastShotTime = now;
        this._ammo.currentClipAmmo--;
 
        // Obtener la posición mundial del arma
        const weaponX = this.parentContainer.x + this.x;
        const weaponY = this.parentContainer.y + this.y;

        // Calcular el ángulo de disparo
        const angle = Phaser.Math.Angle.Between(weaponX, weaponY, targetX, targetY);
        const bulletX = weaponX + Math.cos(angle) * this._specs.muzzleOffset;
        const bulletY = weaponY + Math.sin(angle) * this._specs.muzzleOffset;

        // Crear la bala en la posición del arma
        const bullet = new BasePistolBullet(this.scene, bulletX, bulletY);
        this.scene.add.existing(bullet);
        this.scene.bullets.add(bullet);
        bullet.fire(bulletX, bulletY, angle, this._specs.bulletSpeed);
    }


}