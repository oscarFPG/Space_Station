import Phaser from 'phaser';
import Object from '../base-game-objects/Object';

export default class Laser extends Object {

    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite)
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
        console.log('Restart de escena')
    }

    disable_laser(){
        this.body.checkCollision.none = true
    }

}
