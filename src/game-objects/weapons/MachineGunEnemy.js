import Builder from '../../managers/Builder.js';
import RangeWeapon from '../base-game-objects/RangeWeapon.js'
import BasePistolBullet from '../bullets/BasePistolBullet.js';

export default class MachineGunEnemy extends RangeWeapon {
    
    static MACHINE_GUN_DAMAGE = 3;

    constructor(scene, x, y){
        super(scene, x, y, Builder.ENEMY_WEAPON_MACHINE_GUN, 0xFFFF22);

        // Gun config
        this._specs.name = 'Red pistol'
        this._specs.damage = MachineGunEnemy.MACHINE_GUN_DAMAGE;
        this._specs.bulletSpeed = 666;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 2.15;
        this._specs.reloadTime = 2;
        this._specs.sprite = Builder.AMMO_ENEMY_BASE;
        this._specs.weight = 1;
        
        this._ammo.type = 'pistola'
        this._ammo.clipSize = 25;
        this._ammo.currentClipAmmo = this._ammo.clipSize;
    }

    createBullet(bulletX, bulletY){
            return new BasePistolBullet(this.scene, bulletX, bulletY, this._specs.damage, Builder.AMMO_ENEMY_BASE, this.colorLightBullet)
    }

}