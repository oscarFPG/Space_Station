import Builder from '../../managers/Builder.js';
import RangeWeapon from '../base-game-objects/RangeWeapon.js'
import MachineGunBullet from '../bullets/MachineGunBullet.js';

export default class MachineGunEnemy extends RangeWeapon {
    
    static MACHINE_GUN_DAMAGE = 3;

    constructor(scene, x, y){
        super(scene, x, y, Builder.ENEMY_WEAPON_MACHINE_GUN, 0xFFFF22);

        // Gun config
        this._specs.name = 'Red pistol'
        this._specs.damage = MachineGunEnemy.MACHINE_GUN_DAMAGE;
        this._specs.bulletSpeed = 645;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 2.15;
        this._specs.reloadTime = 2;
        this._specs.sprite = Builder.ENEMY_WEAPON_MACHINE_GUN;
        this._specs.weight = 1;
        this._specs.isEnemyWeapon = true;
        this._specs.laserVision = false;
        
        this._ammo.type = 'machine gun'
        this._ammo.clipSize = 25;
        this._ammo.currentClipAmmo = this._ammo.clipSize;
        this._ammo.reserveAmmo = this._ammo.clipSize
    }

    createBullet(bulletX, bulletY){
            return new MachineGunBullet(this.scene, bulletX, bulletY, this._specs.damage, Builder.AMMO_ENEMY_MACHINE_GUN, this.colorLightBullet)
    }

}