import Phaser from 'phaser'

export default class Entity extends Phaser.Physics.Arcade.Sprite {

    _controller = undefined;

    constructor(scene, x, y){
        super(scene, x, y);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setTexture('');

        this._movementSpeed = 300;
        this.setImmovable(true);
        this._controller = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
        if(this._controller != undefined)
            this.#move();
    }

    #move(){
        
        let Velocity2D = new Phaser.Math.Vector2(0, 0);
        
        // Movimiento vertical => if-elseif para evitar personaje quieto al presionar ambas
        if (this._controller.up.isDown)
            Velocity2D.y = -1;
        else if (this._controller.down.isDown)
            Velocity2D.y = 1;

        // Movimiento horizontal => if-elseif para evitar personaje quieto al presionar ambas
        if (this._controller.left.isDown) {
            Velocity2D.x = -1;
            this.setFlipX(true);
        }
        else if (this._controller.right.isDown) {
            Velocity2D.x = 1;
            this.setFlipX(false);
        }

        Velocity2D.scale(this._movementSpeed);
        this.setVelocity(Velocity2D.x, Velocity2D.y);
    }

}