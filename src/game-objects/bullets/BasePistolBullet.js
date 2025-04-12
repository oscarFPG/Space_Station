import Builder from '../../managers/Builder.js';
import Bullet from '../base-game-objects/Bullet.js'

export default class BasePistolBullet extends Bullet {
    
    constructor(scene, x, y, damage) {
        super(scene, x, y, Builder.AMMO_BASE, damage);
        this.body.setSize(24,12);
    }

}
