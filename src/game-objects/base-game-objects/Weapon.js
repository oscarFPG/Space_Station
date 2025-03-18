import Phaser from 'phaser';

export default class Weapon extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, damage) {
        super(scene, x, y, texture);

        this._damage = damage;
        this.scene.add.existing(this);
    }
}