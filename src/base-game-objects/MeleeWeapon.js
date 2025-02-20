import Phaser from 'phaser'
import Weapon from './Weapon'

export default class MeleeWeapon extends Weapon {

    constructor(scene, x, y){
        super(scene, x, y)
        this.scene.add.existing(this)
    }

    
}