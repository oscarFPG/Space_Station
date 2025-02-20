import Phaser from "phaser";
import Weapon from './Weapon';

export default class Player extends Phaser.GameObjects.Container {
  constructor(scene, x, y, spriteIdleName, spriteRunningName, weaponID) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);

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

  update() {

    this.setPosition(this.body.x, this.body.y);
    // Reiniciar la velocidad del cuerpo del container
    this.body.setVelocity(0);
    let moving = false;

    if (this.cursors.up.isDown || this.keys.up.isDown) {
      this.body.setVelocityY(-650);
      moving = true;
    }
    if (this.cursors.down.isDown || this.keys.down.isDown) {
      this.body.setVelocityY(650);
      moving = true;
    }
    if (this.cursors.left.isDown || this.keys.left.isDown) {
      this.body.setVelocityX(-650);
      this.player.setFlipX(true);
      moving = true;
    }
    if (this.cursors.right.isDown || this.keys.right.isDown) {
      this.body.setVelocityX(650);
      this.player.setFlipX(false);
      moving = true;
    }

    // Actualizar animación según movimiento
    if (moving) {
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
    
    // Calcular el ángulo desde el centro del container hacia el puntero
    let angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
    this.weapon.setRotation(angle);   
    // (Opcional) Voltear verticalmente el arma si el puntero está a la izquierda del jugador
    this.weapon.setFlipY(pointer.worldX < this.x);
  }
}