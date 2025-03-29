import Interactive from "../base-game-objects/Interactive";


export default class Shield extends Interactive {

    static AUMENTO_ESCUDO = 5;
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
    }
    update(time) {
        super.update(time);
    }
    activateAction() {
        if(!this._player.isFullShield()) {
            this.alreadyPulse = true;
            this._player.shieldBoost(Shield.AUMENTO_ESCUDO);
            this.removeLight();
            this.destroy(true);
        }
    }
}