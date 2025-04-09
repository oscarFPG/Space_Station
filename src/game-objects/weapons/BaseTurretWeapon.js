import RangeWeapon from '../base-game-objects/RangeWeapon.js'

export default class BaseTurretWeapon extends RangeWeapon {
    
    static BASE_PISTOL_DAMAGE = 10;
    static BASE_PISTOL_TEXTURE = 'turret';
    static BASE_PISTOL_AMMO_TEXTURE = 'bullet1Turret';

    constructor(scene, x, y){
        super(scene, x, y, BaseTurretWeapon.BASE_PISTOL_TEXTURE, 880088);

        // Gun config
        this._specs.damage = BaseTurretWeapon.BASE_PISTOL_DAMAGE;
        this._specs.bulletSpeed = 700;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 1;
        this._specs.reloadTime = 2;
        this._specs.sprite = BaseTurretWeapon.BASE_PISTOL_TEXTURE;
        this._specs.weight = 1;
        
        this._ammo.clipSize = 20;
        this._ammo.currentClipAmmo = this._ammo.clipSize;
        this._ammo.ammoExtra = 200;
        this._ammo.texture = BaseTurretWeapon.BASE_PISTOL_AMMO_TEXTURE;
    }
}