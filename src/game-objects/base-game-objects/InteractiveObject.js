import Phaser from 'phaser';

export default class InteractiveObject extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)
    this.body.setSize(86, 101);
    this.body.setOffset(17, 10);
    this.setPipeline('Light2D');
  }
  
  configure(player, numberRGB, text) {
    this._player = player;
    this.text = 'Interact';
    if(text != null) {
      this.text = text;
    }
    this.interactionText = this.scene.add.text(this.x, this.y - 50, this.text + ' [E]', { 
      fontSize: '16px', 
      fill: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    });
    this.interactionText.setPipeline('Light2D');
    this.interactionText.setVisible(false);
    this.interactionText.setPosition(this.x, this.y - 50);
    this.scene.physics.add.overlap(player, this, this.showInteraction, null, this);
    this.body.allowGravity = false;
    this.numberRGB = numberRGB;
    this.light = this.scene.lights.addLight(this.x, this.y, 300, this.numberRGB, 0.6);
    this.alreadyPulse = false;
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

  removeLight() {
    if (this.light) {
      this.scene.lights.removeLight(this.light);
      this.light = null; 
    }
  }

  update(time, delta) {
      if (Phaser.Math.Distance.Between(this.x, this.y, this._player.x, this._player.y) > 100) {
          this.interactionText.setVisible(false);
      }
      // Al pulsar E, alterna la ventana
      else if (!this.alreadyPulse && Phaser.Input.Keyboard.JustDown(this.eKey)) {
          if (this.numberRGB === 0xffffff) {
             this.removeLight();
          }
          this.activateAction();
      }
        if (this.light) {
      // Configura el periodo de parpadeo (en milisegundos)
      const blinkPeriod = 1500; // 500ms por ciclo
      const modTime = time % blinkPeriod;
      
      // Si estamos en la primera mitad del periodo, la luz se enciende; si no, se apaga.
      if (modTime < blinkPeriod / 2) {
        this.light.intensity = 0.5; // intensidad "encendida"
      } else {
        this.light.intensity = 0.2; // "apagada"
      }
    }
  }
  configItem() {
    return null
  }
}