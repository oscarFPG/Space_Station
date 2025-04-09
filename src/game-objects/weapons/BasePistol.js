import RangeWeapon from '../base-game-objects/RangeWeapon.js'

export default class BasePistol extends RangeWeapon {
    
    static BASE_PISTOL_DAMAGE = 5;
    static BASE_PISTOL_TEXTURE = 'weapon1';
    static BASE_PISTOL_AMMO_TEXTURE = 'bullet1';

    constructor(scene, x, y){
        super(scene, x, y, BasePistol.BASE_PISTOL_TEXTURE, 0x87CEFA);

        // Gun config
        this._specs.damage = BasePistol.BASE_PISTOL_DAMAGE;
        this._specs.bulletSpeed = 666;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 2.5;
        this._specs.reloadTime = 1.5;
        this._specs.sprite = BasePistol.BASE_PISTOL_TEXTURE;
        this._specs.weight = 1;
        
        this._ammo.clipSize = 12;
        this._ammo.currentClipAmmo = this._ammo.clipSize;
        this._ammo.ammoExtra = 200;
        this._ammo.texture = BasePistol.BASE_PISTOL_AMMO_TEXTURE;
    }
}