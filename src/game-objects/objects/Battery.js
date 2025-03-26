import InteractiveObject from '../base-game-objects/InteractiveObject.js'

export default class Battery extends InteractiveObject {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
    }
    update() {
        super.update();
    }
    activateAction() {
        this._player.pickBattery();
        this.destroy(true);
    }
}