import Phaser from 'phaser';

export default class InteractiveObject extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  
    this.interactionText = scene.add.text(x, y - 50, 'Interactuar [E]', { 
      fontSize: '16px', 
      fill: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    });
    this.interactionText.setPipeline('Light2D');
    this.interactionText.setVisible(false);
    this.body.setSize(86, 101);
    this.body.setOffset(17, 10);
    this.setPipeline('Light2D');
  }
  
  configure(player) {
    this._player = player;
    this.interactionText.setPosition(this.x, this.y - 50);
    this.scene.physics.add.overlap(player, this, this.showInteraction, null, this);
    this.body.allowGravity = false;
    this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }
  showInteraction() {
    this.interactionText.setVisible(true);
  }
  destroy(fromScene) {
    if (this.interactionText) {
      this.interactionText.destroy();
    }
    super.destroy(fromScene);
  }
  update() {
    // Ocultar el texto de interacción si el jugador se aleja
    if (Phaser.Math.Distance.Between(this.x, this.y, this._player.x, this._player.y) > 100) {
        this.interactionText.setVisible(false);
    }
    // Al pulsar E, alterna la ventana
    else if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
        this.activateAction();
    }
}
}