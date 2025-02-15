
import FRONT from '../../assets/images/portada.png'
import Phaser from 'phaser'

export default class Boot extends Phaser.Scene {

    constructor(){
        super({ key: 'boot' });
    }

    preload(){
        this.load.image('front-page', FRONT);
    }

    create(){
        
        // Background image
        this.add.image(80, 0, 'front-page').setOrigin(0, 0);

        // Footer text
        this.add.text(260, 600, 'Press ENTER to start the game...', {
            fontSize: 20,
            backgroundColor: '#000',
            stroke: '#fff',
            strokeThickness: 1.2
        });

        // Custom event for ENTER key
        this.enter_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    }

    update(){

        // Cambiar escena
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){
            this.scene.start('tutorial')
        }
        
    }

}