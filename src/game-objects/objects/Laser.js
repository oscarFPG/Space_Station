import Phaser from 'phaser';
import Object from '../base-game-objects/Object';

export default class Laser extends Object {

    static DEFAULT_DAMAGE = 200;
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite)
        this.body.setOffset(0, 0)
        this.body.setSize(1, 1)
		
    }

    player_overlaps(player){

        this.scene.tweens.add({
            targets: player,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                this.scene.scene.restart();
            }
        })
    }



}
