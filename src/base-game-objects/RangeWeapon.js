import Weapon from './Weapon'

export default class RangeWeapon extends Weapon {

    bullet = {
        damage: undefined,      // Daño del arma
        bulletSpeed: undefined, // Velocidad del proyectil
        sprite: undefined,      // Modelo
        canBounce: undefined,   // Indica si la bala puede rebotar o no con una pared
        canDrill: undefined     // Indica si la bala puede atravesar enemigos
    };

    ammo = {
        clipSize: undefined,        // Numero de balas de un cargador
        currentClipAmmo: undefined, // Balas actuales del cargador
        numClips: undefined,        // Numero de cargadores actuales(Sin contar el actual)
    };

    specs = {
        fireRate: undefined,    // Tiempo transcurrido entre bala y bala
        reloadTime: undefined,  // Tiempo de recarga
        weight: undefined       // Peso del arma -> Afecta a la velocidad de movimiento del personaje
    };

    constructor(scene, x, y){
        super(scene, x, y)
        this.scene.add.existing(this)
    }

}