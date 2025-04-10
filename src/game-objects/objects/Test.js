import Phaser from "phaser"
import Object from '../base-game-objects/Object.js'

export default class Test extends Object {

    constructor(scene){
        super(scene, 400, 450, null)
    }

    preUpdate(time, delta){

        const player = this.scene.get_player()
    }

}