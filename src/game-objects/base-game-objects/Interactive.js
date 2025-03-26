import Phaser from 'phaser'

export default class Interactive extends Phaser.GameObjects.Sprite {

    active = true
    radius = 0
    rangoAccion = 0


    constructor(scene, x, y, texture, radius){
        super(scene, x, y, texture)

        this.radius = radius
        this.rangoAccion = new Phaser.GameObjects.Ellipse(scene, x, y, this.radius, this.radius, 0xff0000, 0.2)
        this.rangoAccion.setVisible(this.scene.game.config.physics.arcade.debug)    // Mostrar solo si debug esta a true
        this.rangoAccion.setOrigin(0.5)
        this.scene.add.existing(this.rangoAccion)
    }
    accion(gameobject){
        console.log('DENTRO')
    }

    interactuar(gameobject){
        
        if(this.active && this.esta_dentro_de_rango(gameobject.x, gameobject.y))
            this.accion(gameobject)
    }

    esta_dentro_de_rango(x, y){
        return Phaser.Math.Distance.Between(this.x, this.y, x, y) < (this.radius / 2)
    }

    set_interactive(state){
        this.active = state
    }
}