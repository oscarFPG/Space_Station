import Phaser from 'phaser'
import Interactive from './Interactive.js'

export default class Object extends Interactive {

    constructor(scene, x, y, texture, radius){
        super(scene, x, y, texture, radius)
        this.scene.add.existing(this)
        this.scene._grupoObjectos.add(this)
    }

}