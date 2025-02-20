import Phaser from 'phaser'


export default class Enemy extends Phaser.GameObjects.Container {

    constructor(scene, x, y){
        super(scene, x, y);
        this._sprite = this.scene.add.sprite(x, y, '', '');
        this.add(this._sprite);
        this.scene.add.existing(this);
        this.addToUpdateList(); // Allow updating
    }

    preUpdate(time, delta){
        
    }

}