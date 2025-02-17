import GeneratorMapTest from './scenes/roomGeneratorTest.js'
import Boot from './scenes/boot.js'
import Tutorial from './scenes/tutorial.js'
import Phaser, { Physics } from 'phaser'

const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 778,
    parent: 'juego',
    scale: {
        //mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    pixelArt: true,
    scene: [ GeneratorMapTest ],
    //scene: [ Boot, Tutorial ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    }
};

new Phaser.Game(config);