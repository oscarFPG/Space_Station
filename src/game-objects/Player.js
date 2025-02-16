import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, spriteIdleName, spriteRunningName) 
    {
        super(scene, x, y, spriteIdleName);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.cursores = this.scene.input.keyboard.createCursorKeys();
        this.scene.anims.create(
            {
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers(spriteIdleName, {start: 0, end:2}),
            frameRate: 6,
            repeat: -1
            }   
        )
        this.scene.anims.create(
            {
            key: 'running',
            frames: this.scene.anims.generateFrameNumbers(spriteRunningName, {start: 0, end:3}),
            frameRate: 10,
            repeat: -1
            }   
        )
        this.play('idle');
    }

    preUpdate(t, dt) 
    {
        super.preUpdate(t, dt);
        this.setVelocity(0);
        let moving = false;
        if (this.cursores.up.isDown || this.cursores.down.isDown || this.cursores.left.isDown || this.cursores.right.isDown)
            moving = true;
        if (this.cursores.up.isDown)
            this.setVelocityY(-650);
        if (this.cursores.down.isDown)
            this.setVelocityY(650);
        if (this.cursores.left.isDown) {
            this.setVelocityX(-650);
            this.setFlipX(true);
        }
        if (this.cursores.right.isDown) {
            this.setVelocityX(650);
            this.setFlipX(false);
        }
        // Cambiar animación dependiendo de la velocidad
        if (moving) {
            if (this.anims.currentAnim.key !== 'running') {
                this.play('running');
            }
        } else {
            if (this.anims.currentAnim.key !== 'idle') {
                this.play('idle');
            }
        }
    }
}