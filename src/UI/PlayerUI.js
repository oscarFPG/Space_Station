import Phaser from 'phaser'
import Player from '../game-objects/Player';

export default class PlayerUI extends Phaser.GameObjects.Container {

    static UI_MARGIN_X = 10;
    static UI_MARGIN_Y = 10;

    constructor(scene, x, y){
        super(scene, x, y)
        this.scene.add.existing(this);
        
        this._barraVida = new Phaser.GameObjects.Sprite(scene, x, y, 'playerUI')
        this._barraVida.setScale(2)
        this._barraVida.setOrigin(0)
        this._barraVida.setScrollFactor(0)
        this.add(this._barraVida)

        this.setPosition(PlayerUI.UI_MARGIN_X, PlayerUI.UI_MARGIN_Y)
    }


    update(){
        super.update();
        console.log('Aquii')
    }

}