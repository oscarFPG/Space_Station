import Phaser from 'phaser';
import Interactive from '../base-game-objects/Interactive'

export default class Laser extends Interactive {

    static DEFAULT_DAMAGE = 200;
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
		
    }

    preUpdate(time, delta) {
        
    }

}
