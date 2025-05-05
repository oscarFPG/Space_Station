import Builder from '../../managers/Builder.js';
import RangeWeapon from '../base-game-objects/RangeWeapon.js'
import MachineGunBullet from '../bullets/MachineGunBullet.js';

export default class MachineGun extends RangeWeapon {
    
    static MACHINE_GUN_DAMAGE = 3.5;

    constructor(scene, x, y){
        super(scene, x, y, Builder.WEAPON_MACHINE_GUN, 0x00FF22);

        // Gun config
        this._specs.name = 'Machine gun V4'
        this._specs.damage = MachineGun.MACHINE_GUN_DAMAGE;
        this._specs.bulletSpeed = 645;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 3.1;
        this._specs.reloadTime = 2;
        this._specs.sprite = Builder.WEAPON_MACHINE_GUN;
        this._specs.weight = 1;
        this._specs.isEnemyWeapon = false;
        this._specs.laserVision = false;
        
        this._ammo.type = 'machine gun'
        this._ammo.clipSize = 30;
        this._ammo.currentClipAmmo = 6;
        this._ammo.reserveAmmo = 0 
        this._ammo.maxReserveAmmo = 60
    }

    createBullet(bulletX, bulletY){
            return new MachineGunBullet(this.scene, bulletX, bulletY, this._specs.damage, Builder.AMMO_BASE_MACHINE_GUN, this.colorLightBullet)
    }

}