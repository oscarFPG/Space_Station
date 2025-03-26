import InteractiveObject from '../base-game-objects/InteractiveObject.js'

export default class Shield extends InteractiveObject {

    static AUMENTO_ESCUDO = 15;
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
    }
    update() {
        super.update();
    }
    activateAction() {
        this._player.shieldBoost(Shield.AUMENTO_ESCUDO);
        this.destroy(true);
    }
}