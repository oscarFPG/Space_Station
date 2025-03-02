import RangeWeapon from "../../base-game-objects/RangeWeapon";

export default class BasePistol extends RangeWeapon {
    
    static BASE_PISTOL_DAMAGE = 2;
    static BASE_PISTOL_TEXTURE = 'weapon1'; 

    constructor(scene, x, y){
        super(scene, x, y, BasePistol.BASE_PISTOL_TEXTURE, BasePistol.BASE_PISTOL_DAMAGE);

        // Gun config
        this._specs.bulletSpeed = 666;
        this._specs.muzzleOffset = 42;
        this._specs.canBounce = false;
        this._specs.canDrill = false;
        this._specs.fireRate = 1;
        this._specs.reloadTime = 2;
        this._specs.sprite = BasePistol.BASE_PISTOL_TEXTURE;
        this._specs.weight = 1;
        
        this._ammo.clipSize = 150;
        this._ammo.currentClipAmmo = this._ammo.clipSize;
        this._ammo.numClips = -1;
    }
}