import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {

        super(scene, x, y);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        // Player attributes
        this._speed = 650;
        this._isMoving = false;

        // Player set up with private methods
        this.#set_up_player_controller();
        this.#set_up_animations();
        this.#set_up_base_weapon();
    }

    preUpdate(t, dt) {

        super.preUpdate(t, dt);
        this.setVelocity(0);

        this._isMoving = false;
        if (this.controller.up.isDown || this.controller.down.isDown || this.controller.left.isDown || this.controller.right.isDown)
            this._isMoving = true;
        
        this.#move();
        this.#changeAnimation();

        // Mantener el arma centrada en el jugador -> Para esto hay que hacer que el jugador se una clase tipo Phaser.GameObjects.Container
        this.weapon.setPosition(this.x + 15, this.y + 32);
        this.weapon.clearAlpha();

        // Obtener coordenadas del mouse y calcular el ángulo hacia el mouse
        const mouseX = this.scene.input.activePointer.worldX;
        const mouseY = this.scene.input.activePointer.worldY;
        const angle = Phaser.Math.Angle.Between(this.x, this.y, mouseX, mouseY);
        this.weapon.setRotation(angle);

        // Rotar modelo del arma si es necesario
        if (mouseX < this.x) 
            this.weapon.setFlipY(true);
        else
            this.weapon.setFlipY(false);
    }

    #set_up_player_controller(){

        this.controller = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    #set_up_animations(){

        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('playerIdle', {start: 0, end:2}),
            frameRate: 6,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'running',
            frames: this.scene.anims.generateFrameNumbers('playerRunning', {start: 0, end:3}),
            frameRate: 10,
            repeat: -1
        });

        this.play('idle');
    }

    #set_up_base_weapon(){
        this.weapon = this.scene.add.image(this.x, this.y, 'weapon');
        this.weapon.setOrigin(0.5, 0.5);
        this.weapon.setDepth(2);
        this.weapon.setAlpha(1);
    }

    #move(){

        let Velocity2D = new Phaser.Math.Vector2(0, 0);

        // Vertical Movement
        if (this.controller.up.isDown)
            Velocity2D.y = -1;
        else if (this.controller.down.isDown)
            Velocity2D.y = 1;

        // Horizontal Movement
        if (this.controller.left.isDown) {
            Velocity2D.x = -1;
            this.setFlipX(true);
        }
        else if (this.controller.right.isDown) {
            Velocity2D.x = 1;
            this.setFlipX(false);
        }

        // Move player
        Velocity2D.scale(this._speed);
        this.setVelocity(Velocity2D.x, Velocity2D.y);
    }

    #changeAnimation(){

        if (this._moving) {
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