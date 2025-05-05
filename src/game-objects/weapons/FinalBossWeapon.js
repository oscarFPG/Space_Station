import Builder from '../../managers/Builder.js';
import RangeWeapon from '../base-game-objects/RangeWeapon.js'
import BasePistolBullet from '../bullets/BasePistolBullet.js';

export default class FinalBossWeapon extends RangeWeapon {
    
    static BASE_PISTOL_DAMAGE = 10;

    constructor(scene, x, y){
        super(scene, x, y, Builder.FINAL_WEAPON, 0xFF2266);

        // Gun config
        this._specs.name = 'FINAL PISTOL V8'
        this._specs.damage = FinalBossWeapon.BASE_PISTOL_DAMAGE;
        this._specs.bulletSpeed = 820;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 1.35;
        this._specs.reloadTime = 2.5;
        this._specs.sprite = Builder.FINAL_WEAPON;
        this._specs.weight = 1;
        this._specs.isEnemyWeapon = true;
        this._specs.laserVision = false;
        
        this._ammo.type = 'pistol master'
        this._ammo.clipSize = 15;
        this._ammo.currentClipAmmo = this._ammo.clipSize;
        this._ammo.reserveAmmo = this._ammo.clipSize
    }

    createBullet(bulletX, bulletY){
            return new BasePistolBullet(this.scene, bulletX, bulletY, this._specs.damage, Builder.AMMO_ENEMY_BASE, this.colorLightBullet)
    }

}