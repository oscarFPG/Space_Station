import Phaser from 'phaser'

export default class Weapon extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y){
        super(scene, x, y, '', '')
        this.scene.add.existing(this)
    }

    attack(){}
    
}