import Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.world.on('worldbounds', () => {
            this.destroy();
        });
    }
    fire(x, y, angle, speed) {
        this.setPosition(x, y);
        this.setRotation(angle);
        this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    }
}