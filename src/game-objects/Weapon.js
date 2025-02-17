import Phaser from "phaser";

export default class Weapon extends Phaser.GameObjects.Image { 
    constructor(scene, x, y, speed, munition, damage, weaponID) {
        const weaponTextures = ['weapon1', 'weapon2', 'weapon3', 'weapon4'];
        const weaponTexture = weaponTextures[weaponID] || 'weapon1';

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
