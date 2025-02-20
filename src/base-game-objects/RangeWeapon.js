import Weapon from './Weapon'

// AQUI TODA LA LOGICA DE UN ARMA DE FUEGO
export default class RangeWeapon extends Weapon {

    specs = {
        bulletSpeed: undefined, // Velocidad del proyectil
        fireRate: undefined,    // Tiempo transcurrido entre bala y bala
        reloadTime: undefined,  // Tiempo de recarga
        weight: undefined,      // Peso del arma -> Afecta a la velocidad de movimiento del personaje
        canBounce: undefined,   // Indica si la bala puede rebotar o no con una pared
        canDrill: undefined,    // Indica si la bala puede atravesar enemigos
        sprite: undefined       // Modelo
    };

    ammo = {
        clipSize: undefined,        // Numero de balas de un cargador
        currentClipAmmo: undefined, // Balas actuales del cargador
        numClips: undefined         // Numero de cargadores actuales(Sin contar el actual)
    };

    constructor(scene, x, y, texture, damage){
        super(scene, x, y, texture, damage)
        this.scene.add.existing(this);
    }

}