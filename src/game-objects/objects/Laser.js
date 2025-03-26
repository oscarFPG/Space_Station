import Phaser from 'phaser';

export default class Laser extends Phaser.GameObjects.Sprite {
    static DEFAULT_DAMAGE = 200;
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setPipeline('Light2D');
        this.body.setSize(30, 100);
        this.body.setOffset(38, 0);
    }

    configure(player) {
        this._player = player;
        this.isActivate = true;
        this.isStatic = this.data.values.isStatic;
        this.scene.physics.add.overlap(player, this, this.damagePlayer, null, this);
    }

    update(time, delta) {
        if (!this.isStatic) {
          if (this._blinkTimer === undefined) {
            this._blinkTimer = 0;
          }
          this._blinkTimer += delta;
          if (this._blinkTimer >= 1200) {
            if (this.active) {
              // Desactivamos el laser: no colisiona y lo ocultamos
              this.setActive(false);
              this.body.checkCollision.none = true;
              this.setVisible(false);
            } else {
              // Activamos el laser: vuelve a colisionar y se muestra
              this.setActive(true);
              this.body.checkCollision.none = false;
              this.setVisible(true);
            }
            // Reiniciamos el temporizador
            this._blinkTimer = 0;
          }
        }
      }
      

    damagePlayer() {
        if (this._player) {
            this._player.quitarVida(Laser.DEFAULT_DAMAGE);
        }
    }
    desactivateLaser() {
        this.destroy(true);
    }

    getIsStoppable() {
        return this.data.values.isStoppable;
    }
}
