import Phaser from "phaser";
import Weapon from './Weapon';

export default class Player extends Phaser.GameObjects.Container {
	
	// Player animation names
	static IDLE_ANIMATION = 'playerIdle';
	static RUNNING_ANIMATION = 'playerRunning';

	constructor(scene, x, y) {

		super(scene, x, y);
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);

    this.player = scene.add.sprite(0, 0, spriteIdleName).setOrigin(0.5, 0.5);

    this.add(this.player);

    // Controles
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.weaponOffset = { x: 15, y: 32 };
    // Crear el arma (tipo Image, no Sprite con física)
    this.weapon = new Weapon(scene, this.weaponOffset.x, this.weaponOffset.y, 20, 10, 2, weaponID);
    // Definir el offset del arma respecto al jugador
   this.add(this.weapon);

    // Crear animaciones
    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNumbers(spriteIdleName, { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'running',
      frames: this.scene.anims.generateFrameNumbers(spriteRunningName, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.player.play('idle');

     // Registra el método update para que se llame en cada frame
     this.scene.events.on('update', this.update, this);
         // Usar el evento 'postupdate' para actualizar el arma después de los cambios de física y render
    this.scene.events.on('postupdate', this.updateWeapon, this);
  }

  update(time, delta) {
    this.setPosition(this.body.x, this.body.y);
    this.body.setVelocity(0);

    const speed = 400;
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.up.isDown || this.keys.up.isDown) {
        velocityY = -1;
    }
    if (this.cursors.down.isDown || this.keys.down.isDown) {
        velocityY = 1;
    }
    if (this.cursors.left.isDown || this.keys.left.isDown) {
        velocityX = -1;
        this.player.setFlipX(true);
    }
    if (this.cursors.right.isDown || this.keys.right.isDown) {
        velocityX = 1;
        this.player.setFlipX(false);
    }

    // Normalizar la velocidad para que no sea mayor en diagonal
    if (velocityX !== 0 || velocityY !== 0) {
        const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        velocityX /= length;
        velocityY /= length;
    }

    this.body.setVelocityX(velocityX * speed);
    this.body.setVelocityY(velocityY * speed);

    // Actualizar animación según movimiento
    if (velocityX !== 0 || velocityY !== 0) {
        if (this.player.anims.currentAnim.key !== "running") {
            this.player.play("running");
        }
    } else {
        if (this.player.anims.currentAnim.key !== "idle") {
            this.player.play("idle");
        }
    }
}
  updateWeapon() {
    const pointer = this.scene.input.activePointer;
    
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    // Calcular el ángulo desde el centro del container hacia el puntero
    let angle = Phaser.Math.Angle.Between(this.x, this.y, worldPoint.x, worldPoint.y);
    this.weapon.setRotation(angle);   
    this.weapon.setFlipY(worldPoint.x < this.x);
  }
}