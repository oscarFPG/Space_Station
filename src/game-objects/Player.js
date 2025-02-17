import Phaser from "phaser";
import Weapon from './Weapon';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteIdleName, spriteRunningName, weaponID) {
    super(scene, x, y, spriteIdleName);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    // Controles
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Crear el arma (tipo Image, no Sprite con física)
    this.weapon = new Weapon(scene, x, y, 20, 10, 2, weaponID);
    // Definir el offset del arma respecto al jugador
    this.weaponOffset = { x: 15, y: 32 };

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

    this.play('idle');

    // Usar el evento 'postupdate' para actualizar el arma después de los cambios de física y render
    this.scene.events.on('postupdate', this.updateWeapon, this);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    // Actualizar movimiento del jugador
    this.setVelocity(0);
    let moving = false;
    if (
      this.cursors.up.isDown || this.keys.up.isDown ||
      this.cursors.down.isDown || this.keys.down.isDown ||
      this.cursors.left.isDown || this.keys.left.isDown ||
      this.cursors.right.isDown || this.keys.right.isDown
    ) {
      moving = true;
    }
    if (this.cursors.up.isDown || this.keys.up.isDown) this.setVelocityY(-650);
    if (this.cursors.down.isDown || this.keys.down.isDown) this.setVelocityY(650);
    if (this.cursors.left.isDown || this.keys.left.isDown) {
      this.setVelocityX(-650);
      this.setFlipX(true);
    }
    if (this.cursors.right.isDown || this.keys.right.isDown) {
      this.setVelocityX(650);
      this.setFlipX(false);
    }

    // Actualizar animación según movimiento
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

  updateWeapon() {
    // Calcular la posición del arma respecto al jugador usando el offset
    const offsetX = this.flipX ? -this.weaponOffset.x : this.weaponOffset.x;
    const offsetY = this.weaponOffset.y;
    this.weapon.setPosition(this.x + offsetX, this.y + offsetY);

    // Calcular la rotación usando la posición del ratón en pantalla
    const pointer = this.scene.input.activePointer;
    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;
    const angle = Phaser.Math.Angle.Between(centerX, centerY, pointer.x, pointer.y);
    this.weapon.setRotation(angle);

    // Voltear el arma verticalmente según la posición del ratón
    this.weapon.setFlipY(pointer.x < centerX);
  }
}
