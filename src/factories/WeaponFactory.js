import BasePistol from '../game-objects/weapons/BasePistol';

export default class WeaponFactory {

    //  Identificadores para evitar 'numeros magicos'
    // Arma base
    static BASE_WEAPON = 'weapon1';

    // Otras armas melee/fuego...


    constructor(){
        throw new Error('La clase \'WeaponFactory\' no se puede y no se debe instanciar');
    }

    static createWeapon(weaponName, scene, weaponOffset){

        console.log(weaponName)
        switch(weaponName){
        case WeaponFactory.BASE_WEAPON:
            return new BasePistol(scene, weaponOffset.x, weaponOffset.y);   // Aqui habria que hacer algo tipo { return new BasePistol() }
            
        // De la misma forma con todas las armas del juego...
        
        default:
            throw new Error(`Objeto \'Weapon\' con identificador ${weapon} no encontrado`)
        }
    }


}