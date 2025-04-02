import Phaser from 'phaser';
import Object from '../base-game-objects/Object';

export default class Laser extends Object {

    static TEXTURE = 'laser2'

    constructor(scene, x, y, ID) {
        super(scene, x, y, Laser.TEXTURE)
        this.body.setOffset(0, 0)
        this.body.setSize(20, 110)

        this._laserID = ID
    }

    player_overlaps(player){

        this.scene.tweens.add({
            targets: player,
            alpha: 0,
            duration: 500,
            onComplete: this.accion(player)
        })
    }

    accion(player){
        this.scene.gameOver()
    }

    activate_laser(){
        this.body.checkCollision.none = false
        this.setAlpha(1)
    }   

    disable_laser(){
        this.body.checkCollision.none = true
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1000
        })
    }

    get_laser_ID(){ return this._laserID }

}
