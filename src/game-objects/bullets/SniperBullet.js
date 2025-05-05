import Bullet from '../base-game-objects/Bullet.js'

export default class SniperBullet extends Bullet {
    
    constructor(scene, x, y, damage, texture, color) {
        super(scene, x, y, texture, damage, color);
        this.body.setSize(28,10);
    }

}
