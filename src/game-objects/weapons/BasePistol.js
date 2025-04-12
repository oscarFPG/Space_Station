import Builder from '../../managers/Builder.js';
import RangeWeapon from '../base-game-objects/RangeWeapon.js'
import BasePistolBullet from '../bullets/BasePistolBullet.js';

export default class BasePistol extends RangeWeapon {
    
    static BASE_PISTOL_DAMAGE = 5;

    constructor(scene, x, y){
        super(scene, x, y, Builder.WEAPON_PISTOLA_BASE, 0x87CEFA);

        // Gun config
        this._specs.damage = BasePistol.BASE_PISTOL_DAMAGE;
        this._specs.bulletSpeed = 666;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 2.5;
        this._specs.reloadTime = 1.5;
        this._specs.sprite = Builder.WEAPON_PISTOLA_BASE;
        this._specs.weight = 1;
        
        this._ammo.clipSize = 12;
        this._ammo.currentClipAmmo = this._ammo.clipSize;
        this._ammo.ammoExtra = 200;
    }

    createBullet(){
        return new BasePistolBullet(this.scene, this.x, this.y, this._specs.damage)
    }

}