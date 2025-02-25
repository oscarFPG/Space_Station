import Phaser from 'phaser'


export default class Enemy extends Phaser.GameObjects.Container {

    constructor(scene, x, y, weapon){
        super(scene, x, y);
        this._sprite = this.scene.add.sprite(x, y, '', '');

        if(weapon)
            this.add(this._sprite);
        
        this.scene.add.existing(this);
        this.addToUpdateList(); // Allow updating
    }

    preUpdate(time, delta){
        
    }

}