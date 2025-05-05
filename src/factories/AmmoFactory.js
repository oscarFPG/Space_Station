import Builder from '../managers/Builder.js';
import AmmoBoxBaseBullet from '../game-objects/objects/AmmoBoxBaseBullet.js'
import AmmoBoxMachineGunBullet from '../game-objects/objects/AmmoBoxMachineGunBullet.js'
import AmmoBoxSniperBullet from '../game-objects/objects/AmmoBoxSniperBullet.js'

export default class AmmoFactory {

    // Identificadores de todas las municiones
    static BASE_WEAPON_AMMO_ID = 0
    static MACHINE_GUN_AMMO_ID = 1
    static SNIPER_AMMO_ID = 2

    constructor(){
        throw new Error('La clase \'AmmoFactory\' no se puede y no se debe instanciar');
    }

    static createAmmoBox(AmmoID, scene, x, y){
        // Hacer esto con polimorfismo - TODO
        switch(AmmoID){
            case AmmoFactory.BASE_WEAPON_AMMO_ID:
                return new AmmoBoxBaseBullet(scene, x, y)
            case AmmoFactory.MACHINE_GUN_AMMO_ID:
                return new AmmoBoxMachineGunBullet(scene, x, y)
            case AmmoFactory.SNIPER_AMMO_ID:
                return new AmmoBoxSniperBullet(scene, x, y)

            default:
                throw new Error(`Objeto \'AMMO\' con identificador ${AmmoID} no encontrado`)
        }
    }


}