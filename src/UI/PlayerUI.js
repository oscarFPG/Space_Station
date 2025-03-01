import Phaser from 'phaser'
import Player from '../game-objects/Player';

export default class PlayerUI extends Phaser.GameObjects.Container {

    static UI_MARGIN_X = 10;
    static UI_MARGIN_Y = 10;

    static BARRA_WIDTH = 5;
    static BARRA_HEIGHT = 16;

    static POS_X = 65;
    static POS_VIDA_Y = 66;
    static POS_ESCUDO_Y = 34;

    static COLOR_BARRA_VIDA = 0xff0000;
    static COLOR_BARRA_ESCUDO = 0x00007a;

    static MAX_NUM_RECTANGLES = 40;

    constructor(scene, x, y){
        super(scene, x, y)
        this.scene.add.existing(this);

        this._barraVida = new Phaser.GameObjects.Sprite(scene, x, y, 'playerUI')
        this._barraVida.setScale(2)
        this._barraVida.setOrigin(0)
        this._barraVida.setScrollFactor(0)
        this.setPosition(PlayerUI.UI_MARGIN_X, PlayerUI.UI_MARGIN_Y)

        this._puntosDeVida = this.crear_barra_vida()
        this._puntosDeArmadura = this.crear_barra_escudo()

        this.add(this._barraVida)
        this.add(this._puntosDeVida)
        this.add(this._puntosDeArmadura)
    }

    crear_barra_vida(){

        var barra = []
        for(let i = 0; i < PlayerUI.MAX_NUM_RECTANGLES; i++){

            const rectangle = this.scene.add.rectangle(
                PlayerUI.POS_X + i*8, 
                PlayerUI.POS_VIDA_Y, 
                PlayerUI.BARRA_WIDTH, 
                PlayerUI.BARRA_HEIGHT, 
                PlayerUI.COLOR_BARRA_VIDA)
            rectangle.setOrigin(0)
            rectangle.setScrollFactor(0)
            barra.push(rectangle)
        }

        return barra;
    }

    crear_barra_escudo(){

        var barra = []
        for(let i = 0; i < PlayerUI.MAX_NUM_RECTANGLES; i++){

            const rectangle = this.scene.add.rectangle(
                PlayerUI.POS_X + i*8, 
                PlayerUI.POS_ESCUDO_Y, 
                PlayerUI.BARRA_WIDTH, 
                PlayerUI.BARRA_HEIGHT, 
                PlayerUI.COLOR_BARRA_ESCUDO)
            rectangle.setOrigin(0)
            rectangle.setScrollFactor(0)
            barra.push(rectangle)
        }

        return barra;
    }

    aumentar_puntos(barra, cantidad){
        
    }

    disminuir_puntos(barra, cantidad){

    }


}