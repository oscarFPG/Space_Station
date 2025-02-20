import RangeWeapon from "../../base-game-objects/RangeWeapon";
import BasePistolBullet from "../bullets/BasePistolBullet";

export default class BasePistol extends RangeWeapon {
    
    static BASE_PISTOL_DAMAGE = 2;
    static BASE_PISTOL_TEXTURE = 'weapon1'; 

    constructor(scene, x, y){
        super(scene, x, y, BasePistol.BASE_PISTOL_TEXTURE , BasePistol.BASE_PISTOL_DAMAGE);
        //se crea un grupo de balas previo
        this.bullets = this.scene.physics.add.group();
    }

    shot(targetX, targetY) {
        // Obtener la posición mundial del arma
        const weaponX = this.x + this.parentContainer.x;
        const weaponY = this.y + this.parentContainer.y;

            // Calcular el ángulo de disparo
        const angle = Phaser.Math.Angle.Between(weaponX, weaponY, targetX, targetY);

        const offset = 40; // Distancia desde el centro hasta la punta del arma
        const bulletX = weaponX + Math.cos(angle) * offset;
        const bulletY = weaponY + Math.sin(angle) * offset;
        // Crear la bala en la posición del arma
        const bullet = new BasePistolBullet(this.scene, bulletX, bulletY);
        this.scene.add.existing(bullet);
        this.bullets.add(bullet);
        const speed = 1000;

        // Disparar la bala
        bullet.fire(bulletX, bulletY, angle, speed);
    }
}