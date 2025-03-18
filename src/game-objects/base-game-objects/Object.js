import Phaser from 'phaser'

export default class Object extends Phaser.GameObjects.Sprite {

    // Rango para detectar objeto
    #rangoAccion

    constructor(scene, x, y, texture){
        super(scene, x, y, texture)
        this.scene.add.existing(this)
        this.setScale(0.05)

        this.#rangoAccion = new Phaser.GameObjects.Ellipse(scene, x, y, 200, 200, 0xff0000, 0.2)
        this.scene.add.existing(this.#rangoAccion)
    }

}