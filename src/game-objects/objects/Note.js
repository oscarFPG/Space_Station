import Phaser from 'phaser';
import InteractiveObject from '../base-game-objects/InteractiveObject';

export default class Note extends InteractiveObject {
  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    this.body.setSize(86, 101);
    this.body.setOffset(17, 10);
    
    // Bandera para saber si la ventana ya está abierta
    this.windowOpen = false;
    // Referencia a los elementos de la ventana
    this.noteElements = null;
    // Referencia al temporizador de cierre automático
    this.delayedClose = null;
  }
  update(time) {
    super.update(time);
  }
  activateAction() {
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
  configItem() {
    this.removeLight();
  }
}
