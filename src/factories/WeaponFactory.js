import BasePistol from '../game-objects/weapons/BasePistol';
import BasePistolEnemy from '../game-objects/weapons/BasePistolEnemy';
import BaseTurretWeapon from '../game-objects/weapons/BaseTurretWeapon';

export default class WeaponFactory {

    //  Identificadores para evitar 'numeros magicos'
    // Arma base
    static BASE_WEAPON = 'weapon1';
    static BASE_WEAPON_ENEMY = 'weapon1Enemy';
    static BASE_TURRET_WEAPON = 'turretWeapon';

    constructor(){
        throw new Error('La clase \'WeaponFactory\' no se puede y no se debe instanciar');
    }

    static createPistol(weaponName, scene, weaponOffset){

    }

    static createSubmachineGun(weaponName, scene, weaponOffset){
        
    }

    static createRifle(weaponName, scene, weaponOffset){
        
    }

    static createShotgun(weaponName, scene, weaponOffset){
        
    }

    static createSniper(weaponName, scene, weaponOffset){
        
    }

    static createWeapon(weaponName, scene, weaponOffset){

        switch(weaponName){
        case WeaponFactory.BASE_WEAPON:
            return new BasePistol(scene, weaponOffset.x, weaponOffset.y)
        case WeaponFactory.BASE_WEAPON_ENEMY:
            return new BasePistolEnemy(scene, weaponOffset.x, weaponOffset.y)
        case WeaponFactory.BASE_TURRET_WEAPON:
            return new BaseTurretWeapon(scene, weaponOffset.x, weaponOffset.y) 
        default:
            throw new Error(`Objeto \'Weapon\' con identificador ${weapon} no encontrado`)
        }
    }

}