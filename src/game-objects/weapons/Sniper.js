import Builder from '../../managers/Builder.js';
import RangeWeapon from '../base-game-objects/RangeWeapon.js'
import SniperBullet from '../bullets/SniperBullet.js';


export default class Sniper extends RangeWeapon {
    
    static BASE_SNIPER_DAMAGE = 20;

    constructor(scene, x, y){
        super(scene, x, y, Builder.WEAPON_SNIPER, 0xEE5522);

        // Gun config
        this._specs.name = 'sniper V4'
        this._specs.damage = Sniper.BASE_SNIPER_DAMAGE;
        this._specs.bulletSpeed = 1300;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 2.25;
        this._specs.reloadTime = 2.6;
        this._specs.sprite = Builder.WEAPON_SNIPER;
        this._specs.weight = 1;
        this._specs.isEnemyWeapon = false;
        this._specs.laserVision = true;
        
        this._ammo.type = 'sniper'
        this._ammo.clipSize = 1;
        this._ammo.currentClipAmmo = 3;
        this._ammo.reserveAmmo = 0
        this._ammo.maxReserveAmmo = 10
    }

    createBullet(bulletX, bulletY){
        return new SniperBullet(this.scene, bulletX, bulletY, this._specs.damage, Builder.AMMO_SNIPER, this.colorLightBullet)
    }

}