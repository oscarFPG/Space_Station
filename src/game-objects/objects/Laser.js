import Phaser from 'phaser'
import Object from '../base-game-objects/Object.js'
import Builder from '../../managers/Builder.js'

export default class Laser extends Object {

    constructor(scene, x, y, ID) {
        super(scene, x, y, Builder.OBJ_LASER_VERTICAL)
        this.body.setOffset(0, 0)
        this.body.setSize(20, 110)

        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0xffffff, 0.7);

        this._laserID = ID
    }

    accion(player){

        this.scene.tweens.add({
            targets: player,
            alpha: 0,
            duration: 500,
            onComplete: this.scene.gameOver()
        })
    }

    activate_laser(){
        this.light = this.scene.lights.addLight(this.x, this.y, 300, 0xffffff, 0.7);
        this.body.checkCollision.none = false
        this.setAlpha(1)
    }   

    disable_laser(){
        if (this.light) {
            this.scene.lights.removeLight(this.light);
            this.light = null; 
        }
        this.body.checkCollision.none = true
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1000
        })
    }

    get_laser_ID(){ return this._laserID }

}
