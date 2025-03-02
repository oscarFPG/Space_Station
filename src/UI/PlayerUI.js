import Phaser from 'phaser'
import Player from '../game-objects/Player';

export default class PlayerUI extends Phaser.GameObjects.Container {

    static UI_MARGIN_X = 10;
    static UI_MARGIN_Y = 10;
    static ANCHO_BARRA_COMPLETA = 318;

    static BARRA_WIDTH = 5;
    static BARRA_HEIGHT = 16;
    static SPACING = 5;

    static POS_X_VIDA = 35;
    static POS_X_ESCUDO = 34;
    static POS_Y_VIDA = 46;
    static POS_Y_ESCUDO = 14;

    static COLOR_BARRA_VIDA = 0xff0000;
    static COLOR_BARRA_ESCUDO = 0x00007a;
    static COLOR_BARRA_VACIA = 0xffffff;

    static MAX_NUM_RECTANGLES = 50;

    constructor(scene, maxHealth, maxEscudo){

        super(scene, 0, 0)
        this.scene.add.existing(this);

        this._MAX_VIDA = maxHealth;
        this._MAX_ESCUDO = maxEscudo;
        this._vidaActual = maxHealth;
        this._barraVida = new Phaser.GameObjects.Sprite(scene, 0, 0, 'playerUI')
        this._barraVida.setScale(2)
        this._barraVida.setOrigin(0)
        this._barraVida.setScrollFactor(0)
        this.setPosition(PlayerUI.UI_MARGIN_X, PlayerUI.UI_MARGIN_Y)

        this._puntosDeVida = this.crear_barra_vida()
        this._puntosDeEscudo = this.crear_barra_escudo()

        this.add(this._barraVida)
        this.add(this._puntosDeVida)
        this.add(this._puntosDeEscudo)
    }

    crear_barra_vida(){

        const rectangle = this.scene.add.rectangle(
            PlayerUI.POS_X_VIDA, 
            PlayerUI.POS_Y_VIDA, 
            PlayerUI.ANCHO_BARRA_COMPLETA, 
            PlayerUI.BARRA_HEIGHT, 
            PlayerUI.COLOR_BARRA_VIDA
        )
        rectangle.setOrigin(0)
        rectangle.setScrollFactor(0)

        return rectangle;
    }

    crear_barra_escudo(){

        const rectangle = this.scene.add.rectangle(
            PlayerUI.POS_X_ESCUDO, 
            PlayerUI.POS_Y_ESCUDO, 
            PlayerUI.ANCHO_BARRA_COMPLETA, 
            PlayerUI.BARRA_HEIGHT, 
            PlayerUI.COLOR_BARRA_ESCUDO
        )
        rectangle.setOrigin(0)
        rectangle.setScrollFactor(0)

        return rectangle;
    }

    aumentar_vida(cantidad){

    }

    disminuir_vida(cantidad){

    }

    aumentar_escudo(cantidad){
        
    }

    disminuir_escudo(cantidad){

    }
    
}