import BasePistol from '../game-objects/weapons/BasePistol.js'
import BasePistolEnemy from '../game-objects/weapons/BasePistolEnemy.js'
import BaseTurretWeapon from '../game-objects/weapons/BaseTurretWeapon.js'
import Builder from '../managers/Builder.js';

export default class WeaponFactory {

    static BASE_WEAPON = 'weapon1';
    static BASE_WEAPON_ENEMY = 'weapon1Enemy';
    static BASE_TURRET_WEAPON = 'turretWeapon';

    constructor(){
        throw new Error('La clase \'WeaponFactory\' no se puede y no se debe instanciar');
    }

    static createPistol(weaponName, scene, weaponOffset){

        const x = weaponOffset.x
        const y = weaponOffset.y

        // Hacer esto con polimorfismo - TODO
        switch(weaponName){
        case Builder.WEAPON_OLD_COLT:
            return null
        case Builder.WEAPON_PISTOLA_BASE:
            return null
        case Builder.WEAPON_2:
            return null
        case Builder.WEAPON_3:
            return null
        case Builder.WEAPON_4:
            return null
        default:
            throw new Error(`Objeto \'Weapon\' con identificador ${weaponName} no encontrado`)
        }
    
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
            throw new Error(`Objeto \'Weapon\' con identificador ${weaponName} no encontrado`)
        }
    }

}