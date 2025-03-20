import Phaser from 'phaser'
import Object from '../base-game-objects/Object.js'


export default class Coin extends Object {

    constructor(scene, x, y){
        super(scene, x, y, 'coinIcon', 140)
        this.setScale(0.015)
        this.setOrigin(0.5)
        this.body.setSize(200, 200)
        this.body.setOffset(0, 0)
    }


    preUpdate(){
        
        var player = this.scene._player ? this.scene._player : null
        if(player)
            this.interactuar(player)
    }

}