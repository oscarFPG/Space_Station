import BasePistol from '../game-objects/weapons/BasePistol.js'
import BasePistolEnemy from '../game-objects/weapons/BasePistolEnemy.js'
import BaseTurretWeapon from '../game-objects/weapons/BaseTurretWeapon.js'
import MachineGunEnemy from '../game-objects/weapons/MachineGunEnemy.js';
import MachineGun from '../game-objects/weapons/MachineGun.js';
import Sniper from '../game-objects/weapons/Sniper.js';
import FinalBossWeapon from '../game-objects/weapons/FinalBossWeapon.js';
import SlowedTurretWeapon from '../game-objects/weapons/SlowedTurretWeapon.js';
import Builder from '../managers/Builder.js';

export default class WeaponFactory {

    // Identificadores de todas las armas
    static BASE_WEAPON = Builder.WEAPON_PISTOLA_BASE
    static BASE_MACHINE_GUN_WEAPON = Builder.WEAPON_MACHINE_GUN
    static SNIPER_WEAPON = Builder.WEAPON_SNIPER
    static BASE_WEAPON_ENEMY = Builder.ENEMY_WEAPON_PISTOLA_BASE
    static BASE_TURRET_WEAPON = Builder.WEAPON_TURRET
    static MACHINE_GUN_WEAPON_ENEMY = Builder.ENEMY_WEAPON_MACHINE_GUN
    static SLOWED_TURRET_WEAPON = Builder.WEAPON_SLOWED_TURRET
    static FINAL_WEAPON = Builder.FINAL_WEAPON
    

    constructor(){
        throw new Error('La clase \'WeaponFactory\' no se puede y no se debe instanciar');
    }

    static crearArma(weaponName, scene, weaponOffset){

        const x = weaponOffset.x
        const y = weaponOffset.y

        // Hacer esto con polimorfismo - TODO
        switch(weaponName){

            // PISTOLAS
            case WeaponFactory.BASE_WEAPON:
                return new BasePistol(scene, x, y)
            case WeaponFactory.BASE_WEAPON_ENEMY:
                return new BasePistolEnemy(scene, x, y)
            case WeaponFactory.BASE_TURRET_WEAPON:
                return new BaseTurretWeapon(scene, x, y)
            case WeaponFactory.MACHINE_GUN_WEAPON_ENEMY:
                return new MachineGunEnemy(scene, x, y)
            case WeaponFactory.SLOWED_TURRET_WEAPON:
                return new SlowedTurretWeapon(scene, x, y);
            case WeaponFactory.BASE_MACHINE_GUN_WEAPON:
                return new MachineGun(scene, x, y);
            case WeaponFactory.SNIPER_WEAPON:
                return new Sniper(scene, x, y);
            case WeaponFactory.FINAL_WEAPON:
                return new FinalBossWeapon(scene, x, y);
            // SUBFUSILES

            // RIFLES

            // ESCOPETAS

            // FRANCOTIRADOR

            default:
                throw new Error(`Objeto \'Weapon\' con identificador ${weaponName} no encontrado`)
        }
    }


}