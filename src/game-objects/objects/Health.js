import InteractiveObject from '../base-game-objects/InteractiveObject.js'

export default class Health extends InteractiveObject {
    static AUMENTO_VIDA = 15;
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
    }
    update() {
        super.update();
    }
    activateAction() {
        this._player.healthBoost(Health.AUMENTO_VIDA);
        this.destroy(true);
    }
}
