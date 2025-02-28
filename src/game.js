import Boot from './scenes/boot.js'
import Store from './scenes/store.js';
import Tutorial from './scenes/tutorial.js'
import Phaser, { Physics } from 'phaser'

const config = {
    type: Phaser.AUTO,
    width: 1400,
    height: 750,
    parent: 'juego',
    scale: {
        //mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    pixelArt: true,
    scene: [ Tutorial, Store ],
    physics: {
        default: 'arcade',
        arcade: {
            fps: 120,
            timeStep: 1/120,
            gravity: { y: 0 },
            debug: true
        }
    }
};

new Phaser.Game(config);