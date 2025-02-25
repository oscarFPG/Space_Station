import Weapon from './Weapon'
import BasePistolBullet from '../game-objects/bullets/BasePistolBullet';

export default class RangeWeapon extends Weapon {

    _specs = {
        bulletSpeed: undefined, // Velocidad del proyectil
        fireRate: undefined,    // Tiempo transcurrido entre bala y bala
        reloadTime: undefined,  // Tiempo de recarga
        weight: undefined,      // Peso del arma -> Afecta a la velocidad de movimiento del personaje
        sprite: undefined,      // Modelo
        canBounce: undefined,   // Indica si la bala puede rebotar o no con una pared
        canDrill: undefined,    // Indica si la bala puede atravesar enemigos
        muzzleOffset: undefined // Distancia desde el centro del modelo hasta el cañon
    };

    _ammo = {
        clipSize: undefined,        // Numero de balas de un cargador
        currentClipAmmo: undefined, // Balas actuales del cargador
        numClips: undefined         // Numero de cargadores actuales(Sin contar el actual) -> -1 indica infinitos
    };

    constructor(scene, x, y, texture, damage){
        super(scene, x, y, texture, damage)
        this.scene.add.existing(this);
    }

    shot(targetX, targetY) {

        // Obtener la posición mundial del arma
        const weaponX = this.parentContainer.x + this.x;
        const weaponY = this.parentContainer.y + this.y;

        // Calcular el ángulo de disparo
        const angle = Phaser.Math.Angle.Between(weaponX, weaponY, targetX, targetY);

        const bulletX = weaponX + Math.cos(angle) * this._specs.muzzleOffset;
        const bulletY = weaponY + Math.sin(angle) * this._specs.muzzleOffset;

        // Crear la bala en la posición del arma
        const bullet = new BasePistolBullet(this.scene, bulletX, bulletY);
        this.scene.add.existing(bullet);
        this.scene.bullets.add(bullet);
        bullet.fire(bulletX, bulletY, angle, this._specs.bulletSpeed);
    }

}