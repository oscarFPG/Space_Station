import Phaser from 'phaser';

export default class BatteryStructure extends Phaser.GameObjects.Sprite {

    static BATERIA_INICIAL = 0;

  constructor(scene, x, y, sprite) {
    super(scene, x, y, sprite);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize(86, 101);
    this.body.setOffset(17, 10);
    this.setPipeline('Light2D');
    // Bandera para saber si la ventana ya está abierta
    this.windowOpen = false;
    this.noteElements = null;
    // Referencia al temporizador de cierre automático
    this.delayedClose = null;
    this._batteries = 0
    this.x = 0;
    this.minimumDistance = 100;
  }
  configure(player, doors) {
      this._player = player;
      this._doors = doors;
      this.scene.physics.add.overlap(player, this, this.showInteraction, null, this);
      this.body.allowGravity = false;
      this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  }

  update() {
    if (Phaser.Math.Distance.Between(this.x, this.y, this._player.x, this._player.y) <= this.minimumDistance && !this.windowOpen) {
      this.activateAction();
    }
  }
  

  activateAction() {
    if (this.windowOpen) {
      this.closeNoteWindow();
      return;
    }
    this._remainingBatteries = this.data.values.numBatteries;
    this.windowOpen = true;
    const windowX = this.x;
    const windowY = this.y - 100;
    
    const stateMessage = `${this._batteries} / ${this._remainingBatteries} CELLS`;
    const stateText = this.scene.add.text(windowX, windowY - 20, stateMessage, {
      fontSize: '18px',
      fill: '#fff',
      wordWrap: { width: 250 }
    });
    stateText.setOrigin(0.5);
    
    let actionText;
    let playerCells = this._player.getBatteries();
    if (playerCells > 0) {
      const actionMessage = `INSERT ${playerCells} CELLS [E]`;
      actionText = this.scene.add.text(windowX, windowY + 20, actionMessage, {
        fontSize: '17px',
        fill: '#ff0',
        wordWrap: { width: 250 }
      });
      actionText.setOrigin(0.5);
      
      this.qKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      
      // Revisamos de forma periódica si se presiona la tecla Q
      this.delayedCheck = this.scene.time.addEvent({
        delay: 100,
        callback: () => {
          if (this.qKey.isDown) {
            const cellsToTransfer = this._player.getBatteries();
            this._player.vaciarBaterias();
            this._batteries += cellsToTransfer;
            // Actualizamos el mensaje de estado
            stateText.setText(`${this._batteries} / ${this._remainingBatteries} CELLS`);
            if (this._batteries === this._remainingBatteries) {
              this.setVisible(false);
              this._doors.forEach(_door => {
                if(!_door.getIsActivate())
                  _door.activateDoor()
              });
            }
            // También se puede actualizar el mensaje de acción para indicar que ya no hay cells
            actionText.setText(`Cells inserted!!!`);
            // Detenemos la comprobación periódica
            this.delayedCheck.remove();
          }
        },
        loop: true
      });
    }
    
    this.noteElements = [stateText];
    if (actionText) {
      this.noteElements.push(actionText);
    }
    this.delayedClose = this.scene.time.delayedCall(2500, () => {
      this.closeNoteWindow();
    });
  }
  
 closeNoteWindow() {
  if (this.delayedCheck) {
    this.delayedCheck.remove();
    this.delayedCheck = null;
  }
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
