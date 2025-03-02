import Phaser from 'phaser';

export default class Laser extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setPipeline('Light2D');
        this.body.setSize(40, 100);
        this.body.setOffset(40,0);
    }
    desactivateLaser() {
        this.destroy();
    }
}
