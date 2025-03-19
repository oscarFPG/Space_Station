import Phaser from 'phaser'
import BaseScene from './BaseScene.js'

export default class Store extends BaseScene {

    constructor(){
        super('store');
    }
    
    create(){
        
        // Background image
        this.add.image(800, 1000, 'store-page')
        
        // Footer text
        this.add.text(300, 600, 'Press ESC to go back to the game...', {
            fontSize: 20,
            backgroundColor: '#000',
            stroke: '#0ff',
            strokeThickness: 1.2
        });

        // Custom event for ENTER key
        this.esc_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update(){

        // Cambiar escena tutorial
        if(Phaser.Input.Keyboard.JustDown(this.esc_key)){
            this.scene.switch('tutorial', 'store');
        }

        // Pedir confirmacion para compra (Cambiar escena)
       

        //Salir de la Tienda
    }

}