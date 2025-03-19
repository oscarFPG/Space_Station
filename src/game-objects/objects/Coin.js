import Phaser from 'phaser'
import Object from '../base-game-objects/Object.js'


export default class Coin extends Object {

    constructor(scene, x, y){
        super(scene, x, y, 'coinIcon', 140)
        this.setScale(0.015)
    }

    interactuar(gameobject){

    }
}