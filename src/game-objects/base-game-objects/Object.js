import Phaser from 'phaser'

export default class Object extends Phaser.GameObjects.Sprite {

    _displayHelperText = false
    _interactiveDistance = 10
    _offsetX = 0
    _offsetY = 0

    constructor(scene, x, y, texture, isInteractive){
        super(scene, x, y, texture)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
        this.setPipeline('Light2D');

        // Configurar evento de solapamiento con el jugador
        const player = scene.get_player()
        if(!player)
            return new Error('La clase necesita una previa referencia al Player')
        
        //this.scene.physics.add.overlap(player, this, this.player_overlaps, null, this)
        this.on('overlapstart', () => {
            this.player_overlaps(player, isInteractive)
        })
        this.scene.physics.add.overlap(this, player)
        if (isInteractive) {
            this.on('overlapend', () => {
                this.player_end_overlaps(player)
            })

            // Cuadro de texto
            this._noteText = ""
            this._textoInteraccion = this.config_helperText()
            this._textoInteraccion.setDepth(12)
            this._textoInteraccion.setVisible(false)

            this.scene.add.existing(this._textoInteraccion)
        }
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);
		const player = this.scene.get_player()
        if(!player)
            return

        // IMPORTANTE - Gestion de overlap con el body
        var touching = !this.body.touching.none || this.body.embedded;
        var wasTouching = !this.body.wasTouching.none;
      
        if (touching && !wasTouching) 
            this.emit('overlapstart')
        if (!touching && wasTouching) 
            this.emit('overlapend')
	}

    player_overlaps(player, isInteractive){
        if (isInteractive) {
            this._textoInteraccion.setVisible(true)
            this._textoInteraccion.setPosition(this.x + this._offsetX, this.y + this._offsetY)
        }
        this.accion(player)
    }

    player_end_overlaps(player){
        this._textoInteraccion.setVisible(false)
    }

    accion(player){
        
    }

    config_helperText(){

        let tecla = 'E' // Temporal

        // Bug: al crearse desde tiled la posicion es (0 - 0) -> Cambiar posicion al querer mostrar este texto
        const text = this.scene.add.text(this.x, this.y, `Interact ${this._noteText}[${tecla}]`, { 
            fontSize: '16px', 
            fill: '#fff',
            backgroundColor: `rgba(0, 0, 0, 0.5)`
        }).setDepth(11)

        return text
    }
    
    setText(text) {
        
        this._text = text;
        if (this._textoInteraccion) {
            // Actualiza el texto existente
            let tecla = 'E' 
            this._textoInteraccion.setText(`${this._text} [${tecla}]`);
        }
    }

    destroyObject(){
        
        this._textoInteraccion.destroy()
        this.destroy()
    }

    removeLight() {

        if (this.light) {
          this.scene.lights.removeLight(this.light);
          this.light = null; 
        }
    }

    update(time) {

        if (this.light) {
            const blinkPeriod = 1500; 
            const modTime = time % blinkPeriod;
            
            if (modTime < blinkPeriod / 2) {
            this.light.intensity = 0.85; // intensidad encendida
            } else {
            this.light.intensity = 0; // apagada
            }
        }
    }
}