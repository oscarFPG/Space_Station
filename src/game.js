import Boot from './scenes/boot.js'
import Tutorial from './scenes/tutorial.js'
import Phaser from 'phaser'

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
    scene: [ Boot, Tutorial ]
};

new Phaser.Game(config);