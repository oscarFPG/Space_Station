import Phaser from 'phaser'

export default class Interactive extends Phaser.GameObjects.Sprite {

    radius = 0
    _rangoAccion = 0


    constructor(scene, x, y, texture){
        super(scene, x, y, texture)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
        this.setOrigin(0.5)
        
        const player = scene.get_player()
        if(player)
            this.scene.physics.add.overlap(player, this, this.#player_overlaps, null, this)

        // Cuadro de texto
        this._textoInteraccion = this.config_helperText()
        this.scene.add.existing(this._textoInteraccion)
    }

    #player_overlaps(player){
        if(player.isUseKeyJustPressed())
            this.accion()
    }

    config_helperText(){

        let tecla = 'E' // Temporal

        const text = this.scene.add.text(this.x, this.y, `Interactuar[${tecla}]`, { 
            fontSize: '16px', 
            fill: '#fff',
            backgroundColor: `rgba(0, 0, 0, 0.5)`
        })
        text.setVisible(false)

        return text
    }

    destroyObject(){
        this._textoInteraccion.destroy()
        this.destroy()
    }

}