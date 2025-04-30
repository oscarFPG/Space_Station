import Boot from './scenes/boot.js'
import Settings from './scenes/Settings.js';
import Store from './scenes/store.js';
import Tutorial from './scenes/tutorial.js'
import Level1 from './scenes/Level1.js'
import Level2 from './scenes/Level2.js'
import Level3 from './scenes/Level3.js';
import VolumeSettings from './scenes/VolumeSettings.js';
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
    scene: [ Boot, Tutorial, Level1, Level2, Level3, Store, Settings,VolumeSettings],
    physics: {
        default: 'arcade',
        arcade: {
            fps: 60,
            timeStep: 1/60,
            gravity: { y: 0 },
            debug: false
        }
    }
};

new Phaser.Game(config);