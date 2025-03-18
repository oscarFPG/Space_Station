import Bullet from '../base-game-objects/Bullet.js'

export default class BasePistolBullet extends Bullet {

    static BASE_PISTOL_TEXTURE = 'bullet1';
    
    constructor(scene, x, y, damage) {
        super(scene, x, y, BasePistolBullet.BASE_PISTOL_TEXTURE, damage);
        this.body.setSize(24,12);
    }   
}
