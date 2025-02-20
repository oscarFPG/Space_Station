

export default class WeaponFactory {

    //  Identificadores para evitar 'numeros magicos'
    // Arma base
    static BASE_WEAPON = 0;

    // Otras armas melee/fuego...


    constructor(){
        throw new Error('La clase \'WeaponFactory\' no se puede y no se debe instanciar');
    }

    createWeapon(weapon){

        switch(weapon){
        case WeaponFactory.BASE_WEAPON:
            return WeaponFactory.BASE_WEAPON;   // Aqui habria que hacer algo tipo { return new BasePistol() }
            
        // De la misma forma con todas las armas del juego...
        
        default:
            throw new Error(`Objeto \'Weapon\' con identificador ${weapon} no encontrado`)
        }
    }


}