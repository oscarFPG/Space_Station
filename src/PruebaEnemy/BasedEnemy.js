import Phaser from 'phaser';
import WeaponFactory from '../factories/WeaponFactory';
import Damageable from '../base-game-objects/Damageable';

export default class BasedEnemy extends Damageable {
     
    // Atributos
    _atributos = {
        speed: undefined,
        visionRange: undefined
    };
    
    constructor(scene, x, y, texture, weapon) {
        super(scene, x, y);
    
        // Crear el sprite del enemigo
        this.enemySprite = scene.add.sprite(28, 32, texture).setOrigin(0.5, 0.5);
        this.add(this.enemySprite);

        // Configurar física
        this.body.setSize(66, 78);
        this.body.setCollideWorldBounds(true);

        this.scene.events.on('quitarVida', (entity, damage) => {
            entity.enemySprite.setTintFill(0xffffff);
            this.scene.time.delayedCall(80, () => {
                this.enemySprite.clearTint();
                this.isImpact = false;
            });
        }, this)

        // Configurar el arma del enemigo, 
        // cambiar por factory (weapon)
        // this.weaponOffset = { x: 39, y: 54};
        // this.weapon = new BasePistol(this.scene, this.weaponOffset.x, this.weaponOffset.y);
        // this.weapon.setOrigin(0.5, 0.5); 
        // this.add(this.weapon);
    }
}