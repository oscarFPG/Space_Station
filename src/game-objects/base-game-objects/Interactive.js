import Phaser from 'phaser'

export default class Interactive extends Phaser.GameObjects.Sprite {

    active = true
    radius = 0
    rangoAccion

    constructor(scene, x, y, texture, radius){
        super(scene, x, y, texture)

        this.radius = radius
        this.rangoAccion = new Phaser.GameObjects.Ellipse(scene, x, y, this.radius, this.radius, 0xff0000, 0.2)
        this.rangoAccion.setVisible(this.scene.game.config.physics.arcade.debug)    // Mostrar solo si debug esta a true
        this.scene.add.existing(this.rangoAccion)
    }

    interactuar(gameobject){
        throw new Error(`La clase '${this.constructor.name}' debe implementar la funcion '${this.interactuar.name}()'`)
    }

    esta_dentro_de_rango(x, y){
        return 
    }

    set_interactive(state){
        this.active = state
    }
}