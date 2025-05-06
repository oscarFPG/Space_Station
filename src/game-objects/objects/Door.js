import Phaser from 'phaser';
import Object from '../base-game-objects/Object';
import Options from '../../managers/Options.js';

export default class Door extends Object {
    static OPEN_ANIMATION = 'doorsAnimation';
    static ACTIVATION_DISTANCE = 200
    static OPENING_DELAY = 700
    static CLOSING_DELAY = 700

    constructor(scene, x, y, active, doorID) {
        super(scene, x, y, Door.OPEN_ANIMATION, false);
        this.setPipeline('Light2D');
        this.body.setImmovable(true);
        this.body.setAllowGravity(false)
        this.body.setSize(60, 90);
        this.body.setOffset(27, 14);

        // Frame inicial de la puerta (cerrada)
        this.setFrame(0);

        this.config_animacion('open_doors', Door.OPEN_ANIMATION, 0, 4, 8);
        this.config_animacion('close_doors', Door.OPEN_ANIMATION, 4, 0, 8);

        // Estado inicial
        this._player = this.scene.get_player()
        this.isActivate = active;
        this._doorID = doorID
        this._isPlayerNearby = false; // Para evitar múltiples reproducciones de animación
    }

    config_animacion(animKey, animName, start, end, frameRate) {
        if (!this.scene.anims.exists(animKey)) {
            this.scene.anims.create({
                key: animKey,
                frames: this.scene.anims.generateFrameNumbers(animName, { start: start, end: end }),
                frameRate: frameRate,
                repeat: 0 // Animación no se repite
            });
        }
    }

    update() {
        // Detectar si el jugador está cerca de la puerta
        if(this.isActivate) {
            const distance = Phaser.Math.Distance.Between(
                this._player.x, this._player.y, this.x, this.y
            );

            if (distance < Door.ACTIVATION_DISTANCE) { // Ajusta el rango según sea necesario
                if (!this._isPlayerNearby) {
                    this._isPlayerNearby = true; 
                    this.activarPuerta();
                    this.body.checkCollision.none = true;
                }
            } else {
                if (this._isPlayerNearby) {
                    this._isPlayerNearby = false; 
                    this.cerrarPuerta();
                    this.body.checkCollision.none = false;
                }
            }
        }
    }
    activarPuerta() {
        const options = Options.get_instance();
        options.playSound(this.scene, 'doors_open', { isMusic: false, volume: 1.0 });
        this.play('open_doors'); 
        this.scene.time.delayedCall(Door.OPENING_DELAY, () => {
            this.setFrame(4); 
        });
    }

    cerrarPuerta() {      
        this.play('close_doors'); 
        this.scene.time.delayedCall(Door.CLOSING_DELAY, () => {
            this.setFrame(0); 
        });
        const options = Options.get_instance();
        options.playSound(this.scene, 'doors_closed', { isMusic: false, volume: 1.0 });  
    }
    set_active(status){
        this.isActivate = status
        console.log('Puerta activada')
    }
    getID(){
        return this._doorID
    }
}
