import RangeWeapon from "../../base-game-objects/RangeWeapon";

export default class BasePistol extends RangeWeapon {
    
    static BASE_PISTOL_DAMAGE = 2;
    static BASE_PISTOL_DAMAGE = 3;
    static BASE_PISTOL_TEXTURE = 'weapon1'; 

    constructor(scene, x, y){
        super(scene, x, y, BasePistol.BASE_PISTOL_TEXTURE , BasePistol.BASE_PISTOL_DAMAGE);
    }
}