import Builder from '../../managers/Builder.js';
import RangeWeapon from '../base-game-objects/RangeWeapon.js'
import BasePistolBullet from '../bullets/BasePistolBullet.js';

export default class BasePistolEnemy extends RangeWeapon {
    
    static BASE_PISTOL_DAMAGE = 5;

    constructor(scene, x, y){
        super(scene, x, y, Builder.ENEMY_WEAPON_PISTOLA_BASE, 0xFF2222);

        // Gun config
        this._specs.name = 'Red pistol'
        this._specs.damage = BasePistolEnemy.BASE_PISTOL_DAMAGE;
        this._specs.bulletSpeed = 715;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 1.25;
        this._specs.reloadTime = 2;
        this._specs.sprite = Builder.ENEMY_WEAPON_PISTOLA_BASE;
        this._specs.weight = 1;
        this._specs.isEnemyWeapon = true;
        this._specs.laserVision = false;
        
        this._ammo.type = 'pistol'
        this._ammo.clipSize = 20;
        this._ammo.currentClipAmmo = this._ammo.clipSize;
        this._ammo.reserveAmmo = this._ammo.clipSize
    }

    createBullet(bulletX, bulletY){
            return new BasePistolBullet(this.scene, bulletX, bulletY, this._specs.damage, Builder.AMMO_ENEMY_BASE, this.colorLightBullet)
    }

}