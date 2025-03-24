import Phaser from 'phaser'
import Object from '../base-game-objects/Object.js'


export default class Heal extends Object {

    constructor(scene, x, y){
        super(scene, x, y, 'heal', 300)

    }


    preUpdate(){
        
    }

}