import Boot from './scenes/Boot.js'
import Settings from './scenes/settings.js';
import Store from './scenes/store.js';
import Tutorial from './scenes/tutorial.js'
import Level1 from './scenes/Level1.js'
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
    scene: [ Boot, Tutorial, Level1, Store, Settings ],
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60,
            timeStep: 1/60,
            gravity: { y: 0 },
            debug: true
        }
    }
};

new Phaser.Game(config);