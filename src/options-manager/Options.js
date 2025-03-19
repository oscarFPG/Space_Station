

/*
    Clase responsable de la configuracion del usuario
    - Volumen de musica
    - Volumen de efectos de sonido
    - Volumen general
    etc...
*/
export default class Options {

    static MAX_VOLUMEN = 1
    static TECLA = 'keydown-ESC'
    #volumen_general
    #volumen_musica
    #volumen_efectos_sonido

    constructor(){

        this.#volumen_general = 0.5
        this.#volumen_musica = 0.5
        this.#volumen_efectos_sonido = 0.5
    }


    cambiar_volumen_general(volumen){
        this.#volumen_general = Phaser.Math.Clamp(volumen, 0, Options.MAX_VOLUMEN)
    }

    cambiar_volumen_musica(volumen){
        this.#volumen_musica = Phaser.Math.Clamp(volumen, 0, Options.MAX_VOLUMEN)
    }

    cambiar_volumen_efectos(volumen){
        this.#volumen_efectos_sonido = Phaser.Math.Clamp(volumen, 0, Options.MAX_VOLUMEN)
    }

}