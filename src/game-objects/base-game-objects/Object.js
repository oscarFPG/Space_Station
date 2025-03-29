import Phaser from 'phaser'

export default class Object extends Phaser.GameObjects.Sprite {


    constructor(scene, x, y, texture){
        super(scene, x, y, texture)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
        
        this.setOrigin(0.5)

        const player = scene.get_player()
        if(player)
            this.scene.physics.add.overlap(player, this, this.player_overlaps, null, this)

        // Cuadro de texto
        this._textoInteraccion = this.config_helperText()
        this._textoInteraccion.setVisible(false)
        this.scene.add.existing(this._textoInteraccion)
    }

    player_overlaps(player){
        if(player.isUseKeyJustPressed())
            this.accion()
    }

    accion(){

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