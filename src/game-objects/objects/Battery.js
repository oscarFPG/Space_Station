import InteractiveObject from '../base-game-objects/InteractiveObject.js'

export default class Battery extends InteractiveObject {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
    }
    update(time) {
        super.update(time);
    }
    activateAction() {
        this._player.pickBattery();
        this.removeLight();
        this.destroy(true);
    }
}