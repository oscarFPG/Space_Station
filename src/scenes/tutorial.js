import Phaser from 'phaser'

export default class Tutorial extends Phaser.Scene {

    constructor(){
        super({ key: 'tutorial' })
    }

    preload(){
        
    }

    create(){
        this.add.text(400, 400, "Escena del tutorial");
    }

    update(){

    }
}