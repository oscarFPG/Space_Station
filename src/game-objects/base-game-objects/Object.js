import Phaser from 'phaser'

export default class Object extends Phaser.GameObjects.Sprite {

    _displayHelperText = false
    _interactiveDistance = 10
    _offsetX = 0
    _offsetY = 0

    constructor(scene, x, y, texture){
        super(scene, x, y, texture)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        // Configurar evento de solapamiento con el jugador
        const player = scene.get_player()
        if(player)
            this.scene.physics.add.overlap(player, this, this.player_overlaps, null, this)

        // Cuadro de texto
        this._textoInteraccion = this.config_helperText()
        this._textoInteraccion.setVisible(false)

        this.scene.add.existing(this._textoInteraccion)
    }

    preUpdate(){

		const player = this.scene.get_player()
        if(!player || !this._displayHelperText)
            return


		const distance = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y)
		if(distance < this._interactiveDistance){
			this._textoInteraccion.setVisible(true)
			this._textoInteraccion.setPosition(this.x + this._offsetX, this.y + this._offsetY)
		}	
		else{
			this._textoInteraccion.setVisible(false)
		}
	}

    player_overlaps(player){
        this.accion(player)
    }

    accion(player){

    }

    config_helperText(){

        let tecla = 'E' // Temporal

        // Bug: al crearse desde tiled la posicion es (0 - 0) -> Cambiar posicion al querer mostrar este texto
        const text = this.scene.add.text(this.x, this.y, `Interactuar[${tecla}]`, { 
            fontSize: '16px', 
            fill: '#fff',
            backgroundColor: `rgba(0, 0, 0, 0.5)`
        })

        return text
    }

    destroyObject(){
        this._textoInteraccion.destroy()
        this.destroy()
    }

}