import Phaser from 'phaser';
import WeaponFactory from '../factories/WeaponFactory';

export default class BasedEnemy extends Phaser.GameObjects.Container {
     
    // Atributos
    _atributos = {
        speed: undefined,
        visionRange: undefined,
        vida: undefined 
    };
    
    constructor(scene, x, y, texture, weapon) {
        super(scene, x, y);
    
        // Crear el sprite del enemigo
        this.enemySprite = scene.add.sprite(28, 32, texture).setOrigin(0.5, 0.5);
        this.add(this.enemySprite);

        // Configurar física
        this.body.setSize(66, 78);
        this.body.setCollideWorldBounds(true);

        // Configurar el arma del enemigo, 
        // cambiar por factory (weapon)
        // this.weaponOffset = { x: 39, y: 54};
        // this.weapon = new BasePistol(this.scene, this.weaponOffset.x, this.weaponOffset.y);
        // this.weapon.setOrigin(0.5, 0.5); 
        // this.add(this.weapon);
    }


    receiveDamage(damage) {
            
        if (this.isImpact) return; 
        this.isImpact = true;
        this.enemySprite.setTintFill(0xffffff);
        this._atributos.vida -= damage;
        if(this._atributos.vida > 0) {
            this.scene.time.delayedCall(80, () => {
                this.enemySprite.clearTint();
                this.isImpact = false;
            });
        }
        else {
            this.scene.tweens.add({
                targets: this.enemySprite,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    this.destroy();
                }
            });
        }
    }
}