import Phaser from 'phaser';

export default class Note extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  
    // Texto de interacción para mayor legibilidad
    this.interactionText = scene.add.text(x, y - 50, 'Interactuar [E]', { 
      fontSize: '16px', 
      fill: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    });
    this.interactionText.setPipeline('Light2D');
    this.interactionText.setVisible(false);
    this.body.setSize(86, 101);
    this.body.setOffset(17, 10);
    
    // Bandera para saber si la ventana ya está abierta
    this.windowOpen = false;
    // Referencia a los elementos de la ventana
    this.noteElements = null;
    // Referencia al temporizador de cierre automático
    this.delayedClose = null;
  }
  
  configure(player) {
    this.player = player;
    this.interactionText.setPosition(this.x, this.y - 50);
    this.scene.physics.add.overlap(player, this, this.showInteraction, null, this);
    this.body.allowGravity = false;
    this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }
  
  showInteraction() {
    this.interactionText.setVisible(true);
  }
  
  update() {
    // Ocultar el texto de interacción si el jugador se aleja
    if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) > 100) {
      this.interactionText.setVisible(false);
    }
    // Al pulsar E, alterna la ventana
    else if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
      this.openNoteWindow();
    }
  }
  
  openNoteWindow() {
    // Si ya está abierta, se cierra la ventana y se sale del método
    if (this.windowOpen) {
      this.closeNoteWindow();
      return;
    }
    
    this.windowOpen = true;
    const windowX = this.x + 100;
    const windowY = this.y - 100;
    
    // Crear el fondo de la ventana
    const windowBg = this.scene.add.rectangle(
      windowX, windowY, 
      200, 125, 
      0x000000, 0.8
    );
    
    // Crear el texto de la nota
    const noteText = this.scene.add.text(
      windowX, windowY, 
      this.data.values.title, 
      { fontSize: '14px', fill: '#fff', wordWrap: { width: 200 } }
    );
    noteText.setOrigin(0.5);
    this.noteElements = [windowBg, noteText];
    
    this.delayedClose = this.scene.time.delayedCall(3000, () => {
      this.closeNoteWindow();
    });
  }
  
  closeNoteWindow() {
    if (this.noteElements) {
      this.noteElements.forEach(el => el.destroy());
      this.noteElements = null;
    }
    this.windowOpen = false;
    if (this.delayedClose) {
      this.delayedClose.remove();
      this.delayedClose = null;
    }
  }
}
