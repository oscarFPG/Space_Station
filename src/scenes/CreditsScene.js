import Phaser from 'phaser';
import BaseScene from './BaseScene.js';

export default class CreditsScene extends BaseScene {
  constructor() {
    super('creditsScene');
  }

  create() {
    const { width, height } = this.scale;

    this._nextScene = 'tutorial'

    this.createBackground(width, height);

    this.putFinalTheme(); 

    this.createAndScrollCredits(width, height);
  }

  // Fondo negro semitransparente
  createBackground(width, height) {
    this.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0);
  }

  // Genera los textos y lanza el tween de scroll
  createAndScrollCredits(width, height) {
    const centerX = width / 2;
    const startY  = height + 50;
    const lineSpacing = 40;

    const styleTitle   = { fontSize: '48px', color: '#ffffff' };
    const styleHeader  = { fontSize: '32px', color: '#7DF9FF' };
    const styleName    = { fontSize: '28px', color: '#cccccc' };

    const lines = [
      { text: 'THE END',        style: styleTitle },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: 'Programming',    style: styleHeader },
      { text: '',               style: styleName },
      { text: 'Ignacio Alejandro Lumbano', style: styleName },
      { text: '',               style: styleName },
      { text: 'Óscar Fabián Pineda',       style: styleName },
      { text: '',               style: styleName },
      { text: 'Daniel Lafuente',  style: styleName },
      { text: '',               style: styleName },
      { text: 'James Morocho',  style: styleName },
      { text: '',               style: styleName },
      { text: 'Art & Game Design',  style: styleHeader },
      { text: '',               style: styleName },
      { text: 'Ignacio Alejandro Lumbano', style: styleName },
      { text: '',               style: styleName },
      { text: 'Music',          style: styleHeader },
      { text: '',               style: styleName },
      { text: 'Ignacio Alejandro Lumbano',  style: styleName },
      { text: '',               style: styleName },
      { text: 'James Morocho',  style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: 'Thank you for playing!', style: styleHeader },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
      { text: '',               style: styleName },
    ];

    // agrupamos todos los textos en un container
    const container = this.add.container(0, 0);
    lines.forEach((line, i) => {
      const txt = this.add.text(
        centerX,
        startY + i * lineSpacing,
        line.text,
        line.style
      ).setOrigin(0.5);
      container.add(txt);
    });

    // tween de subida
    this.tweens.add({
      targets: container,
      y: - (lines.length * lineSpacing + 50),
      ease: 'Linear',
      duration: 30000,
      onComplete: () => {
        // al terminar volvemos al menú (o a la escena anterior)
        const status = {
          health:   this.playerHealth ,
          shield:   this.playerShield,
          money:  this.playerMoney ,
          weapon1: this.playerWeapon1 ,
          weapon2:  this.playerWeapon2,
          previousScene: this._previousScene
        };
        this.scene.start(this._nextScene, status);
      }
    });
  }
}
