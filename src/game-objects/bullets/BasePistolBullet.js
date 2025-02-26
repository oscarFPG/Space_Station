import Bullet from "../../base-game-objects/Bullet";

export default class BasePistolBullet extends Bullet {
    static BASE_PISTOL_TEXTURE = 'bullet1';
    constructor(scene, x, y) {
        super(scene, x, y, BasePistolBullet.BASE_PISTOL_TEXTURE);
        this.body.setSize(40,20);
    }
    
}
