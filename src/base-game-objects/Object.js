import Phaser from 'phaser'

export default class Object extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture){
        super(scene, x, y, texture, '')
        this.scene.add.existing(this)
    }

}