import Phaser from 'phaser'
import FRONT from '../../assets/images/portada.png'

export default class Boot extends Phaser.Scene {

    constructor(){
        super({ key: 'boot' });
    }

    preload(){
        this.load.image('front-page', FRONT);
    }
    
    create(){
        
        // Background image
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'front-page').setOrigin(0.5);

        // Footer text
        this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 100, 'Press ENTER to start the game...', {
            fontSize: 20,
            backgroundColor: '#000',
            stroke: '#fff',
            strokeThickness: 1.2
        })
        .setOrigin(0.5);

        // Custom event for ENTER key
        this.enter_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    }

    update(){

        // Cambiar escena
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){
            this.scene.switch('tutorial', 'boot')
        }   
    }

}