import Builder from '../../managers/Builder.js';
import RangeWeapon from '../base-game-objects/RangeWeapon.js'
import BasePistolBullet from '../bullets/BasePistolBullet.js';

export default class BaseTurretWeapon extends RangeWeapon {
    
    static TURRET_DAMAGE = 10;

    constructor(scene, x, y){
        super(scene, x, y, Builder.WEAPON_TURRENT, 880088);

        // Gun config
        this._specs.damage = BaseTurretWeapon.TURRET_DAMAGE;
        this._specs.bulletSpeed = 700;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 1;
        this._specs.reloadTime = 2;
        this._specs.sprite = Builder.WEAPON_TURRENT;
        this._specs.weight = 1;
        
        this._ammo.type = 'pistola'
        this._ammo.clipSize = 20;
        this._ammo.currentClipAmmo = this._ammo.clipSize;
    }

    createBullet(){
        return new BasePistolBullet(this.scene, this.x, this.y, this._specs.damage)
    }

}