import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, spriteIdleName, spriteRunningName, weaponDefault) 
    {
        super(scene, x, y, spriteIdleName);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.cursores = this.scene.input.keyboard.createCursorKeys();
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.weapon = scene.add.image(x, y, weaponDefault);
        this.weapon.setOrigin(0.5, 0.5);
        this.weapon.setDepth(2);
        this.weapon.setAlpha(1);
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
        if (
            this.cursores.up.isDown || this.keys.up.isDown ||
            this.cursores.down.isDown || this.keys.down.isDown ||
            this.cursores.left.isDown || this.keys.left.isDown ||
            this.cursores.right.isDown || this.keys.right.isDown
        ) {
            moving = true;
        }

        if (this.cursores.up.isDown || this.keys.up.isDown) this.setVelocityY(-650);
        if (this.cursores.down.isDown || this.keys.down.isDown) this.setVelocityY(650);
        if (this.cursores.left.isDown || this.keys.left.isDown) {
            this.setVelocityX(-650);
            this.setFlipX(true);
        }
        if (this.cursores.right.isDown || this.keys.right.isDown) {
            this.setVelocityX(650);
            this.setFlipX(false);
        }

       // Mantener el arma centrada en el jugador
       this.weapon.setPosition(this.x +15, this.y + 32);
       this.weapon.clearAlpha();

       // Obtener coordenadas del mouse y calcular el ángulo hacia el mouse
       const mouseX = this.scene.input.activePointer.worldX;
       const mouseY = this.scene.input.activePointer.worldY;

       const angle = Phaser.Math.Angle.Between(this.x, this.y, mouseX, mouseY);
       this.weapon.setRotation(angle);

        if (mouseX < this.x) {
            this.weapon.setFlipY(true); // Si el mouse está a la izquierda, voltear
        } else {
            this.weapon.setFlipY(false); // Si el mouse está a la derecha, dejar normal
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