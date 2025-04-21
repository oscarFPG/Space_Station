import BasePistol from '../game-objects/weapons/BasePistol.js'
import BasePistolEnemy from '../game-objects/weapons/BasePistolEnemy.js'
import BaseTurretWeapon from '../game-objects/weapons/BaseTurretWeapon.js'
import Builder from '../managers/Builder.js';

export default class WeaponFactory {

    // Identificadores de todas las armas
    static BASE_WEAPON = Builder.WEAPON_PISTOLA_BASE
    static BASE_WEAPON_ENEMY = Builder.ENEMY_WEAPON_PISTOLA_BASE
    static BASE_TURRET_WEAPON = Builder.WEAPON_TURRENT


    constructor(){
        throw new Error('La clase \'WeaponFactory\' no se puede y no se debe instanciar');
    }

    
    static crearPistola(weaponName, scene, weaponOffset){

        const x = weaponOffset.x
        const y = weaponOffset.y

        // Hacer esto con polimorfismo - TODO
        switch(weaponName){
        case WeaponFactory.BASE_WEAPON:
            return new BasePistol(scene, x, y)

        case WeaponFactory.BASE_WEAPON_ENEMY:
            return new BasePistolEnemy(scene, x, y)

        case WeaponFactory.BASE_TURRET_WEAPON:
            return new BaseTurretWeapon(scene, x, y)

        default:
            throw new Error(`Objeto \'Weapon\' con identificador ${weaponName} no encontrado`)
        }
    
    }

    static crearSubfusil(weaponName, scene, weaponOffset){
        
    }

    static crearRifle(weaponName, scene, weaponOffset){
        
    }

    static crearEscopeta(weaponName, scene, weaponOffset){
        
    }

    static crearSniper(weaponName, scene, weaponOffset){
        
    }

}