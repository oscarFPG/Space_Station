import Phaser from 'phaser'
//import FRONT from '../../assets/store/storeMenu.png'
import FRONT from '../../assets/store/example.png'
//import TilemapStore from '../../assets/store/TilemapStore.png'

export default class Store extends Phaser.Scene {

    constructor(){
        super({ key: 'store' });
    }

    preload(){
        
        //this.load.image('tiles', TilemapStore);
        this.load.image('store-page', FRONT);
    }
    
    create(){
        
        // Background image
        this.add.image(800, 1000, 'store-page').setOrigin(0, 0);

        // Background image
        //var map = this.make.tilemap({key: 'store', tileWidth: 185, tileHeight: 185});
        //var tileset = map.addTilesetImage('Tilemap', 'tiles');   
        //var layer = map.createLayer('topLayer', tileset, 0, 0);
        
        //Temporal!!!
        
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