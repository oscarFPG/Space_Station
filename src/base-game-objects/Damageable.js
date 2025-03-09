import Phaser from 'phaser'

export default class Damageable extends Phaser.GameObjects.Container {

    constructor(scene, x, y, texture, health) {
        super(scene, x, y, texture);
        
        this.health = health;
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    quitarVida(damage) {

        this.health -= damage;
        if (this.health <= 0) {
            this.destroy();
        }
    }
}