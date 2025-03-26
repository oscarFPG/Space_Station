import Phaser from 'phaser';

export default class Box extends Phaser.GameObjects.Sprite {
    static BROKEN_ANIMATION = 'boxAnimation';
    static VIDA_INICIAL = 10;

    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setPipeline('Light2D');
        this._vida = Box.VIDA_INICIAL;
        this.body.setImmovable(true);
        this.body.setAllowGravity(false)
        this.body.setSize(60, 90);	
        this.body.setOffset(27,14);

        this.config_animacion('broken_box', Box.BROKEN_ANIMATION, 1, 4, 6);

        // Evento para detectar cuando termina la animación
        this.on('animationcomplete', (animation) => {
            if (animation.key === 'broken_box') {
                this.setFrame(4); 
            }
        });
    }
    config_animacion(animKey, animName, start, end, frameRate) {
        if (!this.scene.anims.exists(animKey)) {
            this.scene.anims.create({
                key: animKey,
                frames: this.scene.anims.generateFrameNumbers(animName, { start: start, end: end }),
                frameRate: frameRate,
                repeat: 0 // Se ejecuta solo una vez
            });
        }
    }
    quitarVida(cantidad){
	    this._vida -= cantidad
        this.setTintFill(0xffffff);
        this.scene.time.delayedCall(60, () => {
			this.clearTint();
		});
		if(this._vida <= 0) {
            this.body.checkCollision.none = true;
            this.play('broken_box');
        }
    }
}
