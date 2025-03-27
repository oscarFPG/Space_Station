import InteractiveObject from '../base-game-objects/InteractiveObject.js'

export default class Health extends InteractiveObject {
    static AUMENTO_VIDA = 5;
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
    }
    update(time) {
        super.update(time);
    }
    activateAction() {
        if(!this._player.isFullHealth()) {
            this._player.healthBoost(Health.AUMENTO_VIDA);
            this.removeLight();
            this.destroy(true);
        }
    }
}
