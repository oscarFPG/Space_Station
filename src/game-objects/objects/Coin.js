import InteractiveObject from '../base-game-objects/InteractiveObject.js'

export default class Coin extends InteractiveObject {
    static MONEY_VALUE = 25
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
    }
    update(time) {
        super.update(time);
    }
    activateAction() {
        this._player.moneyBoost(Coin.MONEY_VALUE);
        this.alreadyPulse = true;
        this.removeLight();
        this.destroy(true);
    }
}