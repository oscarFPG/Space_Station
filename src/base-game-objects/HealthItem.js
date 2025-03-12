import InteractiveObject from './InteractiveObject';

export default class HealthItem extends InteractiveObject {

    static AUMENTO_VIDA = 15;
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
    }
    update() {
        // Ocultar el texto de interacción si el jugador se aleja
        if (Phaser.Math.Distance.Between(this.x, this.y, this._player.x, this._player.y) > 100) {
            this.interactionText.setVisible(false);
        }
        // Al pulsar E, alterna la ventana
        else if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
            this.activateAction();
        }
    }
    activateAction() {
        this.scene.receiveHealthPlayer(HealthItem.AUMENTO_VIDA);
        this.destroy(true);
    }
}
