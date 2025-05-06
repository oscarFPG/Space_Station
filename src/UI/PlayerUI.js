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
    static POS_X_MONEDAS = 32;
    static POS_Y_MONEDAS = 80;
    static POS_X_BATERIAS = 42;
    static POS_Y_BATERIAS = 120;
    
    static POS_X_BALAS = 30;
    static POS_Y_BALAS = 700;

    static COLOR_BARRA_VIDA = 0xffffff; 
    static COLOR_BARRA_ESCUDO = 0x00ffff;
    static COLOR_BARRA_VACIA = 0xffffff;

    static DIMENSION_TEXTO = 25;


    constructor(scene, maxHealth, maxEscudo, dineroInicial, bateriasIniciales){

        super(scene, 0, 0)
        this.scene.add.existing(this);
        this.setPosition(PlayerUI.UI_MARGIN_X, PlayerUI.UI_MARGIN_Y)
        this.setDepth(1)

        this._MAX_VIDA = maxHealth;
        this._MAX_ESCUDO = maxEscudo;
        this._barraVida = new Phaser.GameObjects.Sprite(scene, 0, 0, 'playerUI')
        this._barraVida.setScale(2)
        this._barraVida.setOrigin(0)
        this._barraVida.setScrollFactor(0)

        this._puntosDeVida = this.crear_barra_vida()
        this._puntosDeEscudo = this.crear_barra_escudo()
        this._contadorBaterias = this.crear_contador_baterias(bateriasIniciales)
        this._contadorMonedas = this.crear_contador_monedas(dineroInicial)
        this._contadorBalas = this.crear_contador_balas(null, null)
        
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

        const offsetX = 37.75
        const offsetY = 12

        const monedas = this.scene.add.container(PlayerUI.POS_X_MONEDAS, PlayerUI.POS_Y_MONEDAS)
        const cantidad = this.scene.add.text(-8, -3, dineroInicial)
        const sprite = this.scene.add.image(cantidad.x + offsetX, cantidad.y + offsetY, 'coinIcon').setScale(0.72).setOrigin(1.1, 0.55)

        monedas.setScrollFactor(0)
        monedas.addAt(cantidad, 0)
        monedas.addAt(sprite, 1)

        return monedas
    }

    crear_contador_baterias(bateriasIniciales){

        const offsetX = 35.75
        const offsetY = 15

        const baterias = this.scene.add.container(PlayerUI.POS_X_BATERIAS, PlayerUI.POS_Y_BATERIAS)
        const cantidad = this.scene.add.text(-17.75, -5, bateriasIniciales)
        const sprite = this.scene.add.image(cantidad.x + offsetX, cantidad.y + offsetY, 'batteryIcon').setScale(0.55).setOrigin(1.1, 0.55)

        baterias.setScrollFactor(0)
        baterias.addAt(cantidad, 0)
        baterias.addAt(sprite, 1)
        baterias.setDepth(11)

        return baterias
    }

    crear_contador_balas(currentBullets, reserveBullets){

        const balas = this.scene.add.container(PlayerUI.POS_X_BALAS, PlayerUI.POS_Y_BALAS)
        const cargador = this.scene.add.text(0, 0, currentBullets)
        cargador.setFontSize(PlayerUI.DIMENSION_TEXTO);
        cargador.setOrigin(1, 0.5)  // Importante -> crece el texto hacia la izquierda, no a la derecha

        const separador = this.scene.add.text(cargador.x + 10, 0, '/')
        separador.setFontSize(PlayerUI.DIMENSION_TEXTO);
        separador.setOrigin(1, 0.5)

        const reserva = this.scene.add.text(separador.x + 2, 0, reserveBullets)
        reserva.setFontSize(PlayerUI.DIMENSION_TEXTO);
        reserva.setOrigin(0, 0.5)

        balas.setScrollFactor(0)
        balas.add(cargador)
        balas.add(separador)
        balas.add(reserva)

        return balas
    }

    actualizar_UI(vidaActual, escudoActual, dineroActual, bateriasActuales, balasCargador, balasReserva, balasMaximas){

        const porcentajeVida = Math.min(Math.max(vidaActual / this._MAX_VIDA, 0), 1)
        const porcentajeEscudo = Math.min(Math.max(escudoActual / this._MAX_ESCUDO, 0), 1)
        // Vida y escudo
        this._puntosDeVida.scaleX = porcentajeVida
        this._puntosDeEscudo.scaleX = porcentajeEscudo

        // Monedas
        this._contadorMonedas.getAt(0).destroy()
        const cantidadMonedas = this.scene.add.text(-2, 0, `${dineroActual} Score`)
        this._contadorMonedas.addAt(cantidadMonedas, 0)

        // Baterías
        this._contadorBaterias.getAt(0).destroy()
        const cantidadBaterias = this.scene.add.text(-1.8, -0, `${bateriasActuales} Cells`)
        this._contadorBaterias.addAt(cantidadBaterias, 0)

        // Balas
        this._contadorBalas.getFirst().destroy()
        this._contadorBalas.getFirst().destroy()
        this._contadorBalas.getFirst().destroy()


        const cargador = this.scene.add.text(0, 0, balasCargador)
            .setOrigin(1, 0.5)
            .setFontSize(PlayerUI.DIMENSION_TEXTO);

        const separador = this.scene.add.text(cargador.x + 10, 0, ' / ')
            .setOrigin(0.57, 0.5)
            .setFontSize(PlayerUI.DIMENSION_TEXTO);

        const reserva = this.scene.add.text(separador.x + 2, 0, balasReserva)
            .setOrigin(0, 0.5)
            .setFontSize(PlayerUI.DIMENSION_TEXTO);


        const porcentajeBalas = balasCargador / balasMaximas;

        if (porcentajeBalas <= 0.15) {
            cargador.setTint(0xff0000)
            separador.setTint(0xff0000)
            reserva.setTint(0xff0000)
        } else {
            cargador.clearTint();
            separador.clearTint();
            reserva.clearTint();
        }

        this._contadorBalas.add(cargador)
        this._contadorBalas.add(separador)
        this._contadorBalas.add(reserva)
    }
}