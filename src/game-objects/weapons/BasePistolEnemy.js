import RangeWeapon from '../base-game-objects/RangeWeapon.js'

export default class BasePistolEnemy extends RangeWeapon {
    
    static BASE_PISTOL_DAMAGE = 5;
    static BASE_PISTOL_TEXTURE = 'weapon1Enemy';
    static BASE_PISTOL_AMMO_TEXTURE = 'bullet1Enemy';

    constructor(scene, x, y){
        super(scene, x, y, BasePistolEnemy.BASE_PISTOL_TEXTURE, 0xFF2222);

        // Gun config
        this._specs.damage = BasePistolEnemy.BASE_PISTOL_DAMAGE;
        this._specs.bulletSpeed = 666;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 1;
        this._specs.reloadTime = 1.5;
        this._specs.sprite = BasePistolEnemy.BASE_PISTOL_TEXTURE;
        this._specs.weight = 1;
        
        this._ammo.clipSize = 20;
        this._ammo.currentClipAmmo = this._ammo.clipSize;
        this._ammo.ammoExtra = 200;
        this._ammo.texture = BasePistolEnemy.BASE_PISTOL_AMMO_TEXTURE;
    }
}