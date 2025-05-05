import Builder from '../../managers/Builder.js';
import RangeWeapon from '../base-game-objects/RangeWeapon.js'
import BasePistolBullet from '../bullets/BasePistolBullet.js';


export default class BasePistol extends RangeWeapon {
    
    static BASE_PISTOL_DAMAGE = 5;

    constructor(scene, x, y){
        super(scene, x, y, Builder.WEAPON_PISTOLA_BASE, 0x87CEFA);

        // Gun config
        this._specs.name = 'pistol V2'
        this._specs.damage = BasePistol.BASE_PISTOL_DAMAGE;
        this._specs.bulletSpeed = 666;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 2.25;
        this._specs.reloadTime = 1.5;
        this._specs.sprite = Builder.WEAPON_PISTOLA_BASE;
        this._specs.weight = 1;
        this._specs.isEnemyWeapon = false;
        this._specs.laserVision = false;
        
        this._ammo.type = 'pistol'
        this._ammo.clipSize = 8;
        this._ammo.currentClipAmmo = 8;
        this._ammo.reserveAmmo = 16
        this._ammo.maxReserveAmmo = 45
    }

    createBullet(bulletX, bulletY){
        return new BasePistolBullet(this.scene, bulletX, bulletY, this._specs.damage, Builder.AMMO_BASE, this.colorLightBullet)
    }

}