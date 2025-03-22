import Phaser from 'phaser'
import Player from '../game-objects/characters/Player';

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
    static POS_X_MONEDAS = 30;
    static POS_Y_MONEDAS = 75;
    static POS_X_BALAS = 30;
    static POS_Y_BALAS = 700;

    static COLOR_BARRA_VIDA = 0xff0000;
    static COLOR_BARRA_ESCUDO = 0x00007a;
    static COLOR_BARRA_VACIA = 0xffffff;


    constructor(scene, maxHealth, maxEscudo, dineroInicial){

        super(scene, 0, 0)
        this.scene.add.existing(this);
        this.setPosition(PlayerUI.UI_MARGIN_X, PlayerUI.UI_MARGIN_Y)

        this._MAX_VIDA = maxHealth;
        this._MAX_ESCUDO = maxEscudo;
        this._barraVida = new Phaser.GameObjects.Sprite(scene, 0, 0, 'playerUI')
        this._barraVida.setScale(2)
        this._barraVida.setOrigin(0)
        this._barraVida.setScrollFactor(0)

        this._puntosDeVida = this.crear_barra_vida()
        this._puntosDeEscudo = this.crear_barra_escudo()
        this._contadorMonedas = this.crear_contador_monedas(dineroInicial)
        this._contadorBalas = this.crear_contador_balas()
        
        this.add(this._barraVida)
        this.add(this._puntosDeVida)
        this.add(this._puntosDeEscudo)
        this.add(this._contadorMonedas)
        this.add(this._contadorBalas)
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

    crear_contador_monedas(dineroInicial){

        const offsetX = 35
        const offsetY = 8

        const monedas = this.scene.add.container(PlayerUI.POS_X_MONEDAS, PlayerUI.POS_Y_MONEDAS)
        const cantidad = this.scene.add.text(0, 0, dineroInicial)
        const sprite = this.scene.add.image(cantidad.x + offsetX, cantidad.y + offsetY, 'coinIcon').setScale(0.025).setOrigin(0.5)

        monedas.setScrollFactor(0)
        monedas.addAt(cantidad, 0)
        monedas.addAt(sprite, 1)

        return monedas
    }

    crear_contador_balas(){

        const balas = this.scene.add.container(PlayerUI.POS_X_BALAS, PlayerUI.POS_Y_BALAS)
        const cargador = this.scene.add.text(0, 0, '-')
        cargador.setOrigin(1, 0.5)  // Importante -> crece el texto hacia la izquierda, no a la derecha

        const separador = this.scene.add.text(cargador.x + 10, 0, '/')
        separador.setOrigin(1, 0.5)

        const reserva = this.scene.add.text(separador.x + 2, 0, '-')
        reserva.setOrigin(0, 0.5)

        balas.setScrollFactor(0)
        balas.addAt(cargador, 0)
        balas.addAt(separador, 1)
        balas.addAt(reserva, 2)

        return balas
    }

    actualizar_UI(vidaActual, escudoActual, dineroActual, balasCargador, balasReserva){

        const porcentajeVida = Math.min(Math.max(vidaActual / this._MAX_VIDA, 0), 1)
        const porcentajeEscudo = Math.min(Math.max(escudoActual / this._MAX_ESCUDO, 0), 1)
        const cantidad = this.scene.add.text(0, 0, dineroActual)
        

        // Vida y escudo
        this._puntosDeVida.scaleX = porcentajeVida
        this._puntosDeEscudo.scaleX = porcentajeEscudo

        // Monedas
        this._contadorMonedas.getAt(0).destroy()
        this._contadorMonedas.addAt(cantidad, 0)

        // Balas

    }

}