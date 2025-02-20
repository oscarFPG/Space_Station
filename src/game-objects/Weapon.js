import Phaser from 'phaser';

export default class Weapon extends Phaser.Physics.Arcade.Sprite {

    static BASE_WEAPON = 0;

    constructor(scene, x, y, speed, munition, damage, weaponID) {

        super(scene, x, y, weaponTexture);
        this.speed = speed;
        this.munition = munition;
        this.damage = damage;
        this.weaponID = weaponID;

        this.scene.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.setDepth(2);
    }

    fire(x, y, angle, time) {
        
        if (time > this.lastFired && this.munition > 0) {
            //const bullet = this.scene.add.image(x, y, 'bullet');
            bullet.setRotation(angle);
            this.scene.physics.world.enable(bullet);
            this.scene.physics.velocityFromRotation(angle, 500, bullet.body.velocity);
            this.lastFired = time + this.speed;
            this.munition--;
        }
    }
}
