import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import Options from '../managers/Options.js'

export default class VolumeSettings extends BaseScene {

    constructor() {
        super('volumeSettings');
    }
    init(data) {
        this._previousScene = data.previousScene || 'GameScene';
    //this.scene.pause(this._previousScene); // Por si acaso no estaba pausada aún
    }

  create() {
    const { width, height } = this.scale;

    // Fondo semitransparente
    this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);

    // Panel
    const panelW = 360;
    const panelH = 240;
    const panelX = (width - panelW) / 2;
    const panelY = (height - panelH) / 2;

    this.add.rectangle(panelX, panelY, panelW, panelH, 0x222222, 0.9)
      .setOrigin(0)
      .setStrokeStyle(4, 0x7DF9FF);

    // Título
    this.add.text(width/2, panelY + 30, 'Volumen', {
      fontSize: '32px',
      color: '#7DF9FF'
    }).setOrigin(0.5);

    // Obtener la instancia de Options
    const options = Options.get_instance();

    // Botones de volumen (estructura de botones)
    const opciones = [
      { text: `Volumen General: ${Math.round(options.get_volumen_general() * 100)}%`, action: 'general' }, /*me redondea al porcentaje mas
      cercano que me devuelva options.get_volumen_general*/ 
      { text: `Volumen Música: ${Math.round(options.get_volumen_musica() * 100)}%`, action: 'musica' }, /*action es como un descriptor 
      que usamos para luego usarlo en onVolumeChange*/
      { text: `Efectos de Sonido: ${Math.round(options.get_volumen_efectos_sonido() * 100)}%`, action: 'efectos' }
    ];

    const startY = panelY + 80;
    const spacing = 45;

    opciones.forEach((opt, i) => {
      const y = startY + i * spacing;
  
      const btn = this.add.text(width/2, y, opt.text, {
        fontSize: '24px',
        color: '#ffffff'
      }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => btn.setColor('#7DF9FF'))//esto es lo de pasar el raton por encima
      .on('pointerout', () => btn.setColor('#ffffff'))//esto es cuando el raton deja de pasar
      .on('pointerdown', () => this.onVolumeChange(opt.action));//las creo botones

    });



const btnMargin = 20;

// "Volver"
const backBtn = this.add.text(panelX + btnMargin, panelY + panelH - btnMargin, 'Volver', {
  fontSize: '20px',
  color: '#7DF9FF'
})
.setOrigin(0, 1)
.setInteractive({ useHandCursor: true })
.on('pointerover', () => backBtn.setColor('#ffffff'))
.on('pointerout', () => backBtn.setColor('#7DF9FF'))
.on('pointerdown', () => {
  this.scene.stop(); // Cerramos VolumeSettings
  this.scene.launch('settings', { previousScene: this._previousScene }); // Reabrir ajustes
});

// "Guardar"
const saveBtn = this.add.text(panelX + panelW - btnMargin, panelY + panelH - btnMargin, 'Guardar', {
  fontSize: '20px',
  color: '#7DF9FF'
})
.setOrigin(1, 1)
.setInteractive({ useHandCursor: true })
.on('pointerover', () => saveBtn.setColor('#ffffff'))
.on('pointerout', () => saveBtn.setColor('#7DF9FF'))
.on('pointerdown', () => {
  console.log('Cambios guardados');
  // añadir logica
});
  }
//aqui voy sumando 0.1 a cada cosa
  onVolumeChange(type) {
    const options = Options.get_instance();
    switch(type) {
      case 'general':
        options.cambiar_volumen_general(options.get_volumen_general() + 0.1);
        break;
      case 'musica':
        options.cambiar_volumen_musica(options.get_volumen_musica() + 0.1);
        break;
      case 'efectos':
        options.cambiar_volumen_efectos(options.get_volumen_efectos_sonido() + 0.1);
        break;
      default:
        break;
    }
    this.scene.restart(); // Para que los cambios se reflejen inmediatamente
  }
}