import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import Builder from '../managers/Builder.js'
import Options from '../managers/Options.js'


export default class Store extends BaseScene {

    // Background image
    X_BACKGROUND
    Y_BACKGROUND
    ANCHO_BACKGROUND
    ALTO_BACKGROUND

    // Margenes
    ESPACIO_ENTRE_LINEA

    // Posicion linea de comando
    X_COMANDO
    Y_COMANDO


    _storeElements = []
    _historialComandos = []
    _comandoActual = ''
    _comandoActualText

    constructor(){
        super(Builder.ESCENA_TIENDA)

        this.X_BACKGROUND = 700
        this.Y_BACKGROUND = 350
        this.ANCHO_BACKGROUND = 700
        this.ALTO_BACKGROUND = 500

        this.ESPACIO_ENTRE_LINEA = 20

        this.X_COMANDO = this.X_BACKGROUND / 2 + 15
        this.Y_COMANDO = 575
    }
    
    init(data) {
        this._previousScene = data.previousScene
    }

    create(){
        
        this.config_interfaz()
        this.config_eventos_teclado()
    }

    config_interfaz(){

        const background = this.add.rectangle(      // Fondo de la consola
            this.X_BACKGROUND, this.Y_BACKGROUND, 
            this.ANCHO_BACKGROUND, this.ALTO_BACKGROUND, 
            0x000000, 1
        )
        background.setOrigin(0.5)
        this._storeElements.push( background )
        
        const mensajeAyuda = this.add.text(         // Mensaje de ayuda para saber como utilziar la consola
            this.X_COMANDO, this.Y_COMANDO - this.ESPACIO_ENTRE_LINEA,
            'Ejecute el comando \'help\' para obtener mas ayuda'
        )
        this._historialComandos.push(mensajeAyuda)

        const guiaComando = this.add.text(          // Simbolo para indicar donde aparece el comando introducido
            this.X_COMANDO, this.Y_COMANDO,
            '>'
        )
        this._historialComandos.push(guiaComando)

        this._comandoActualText = this.add.text(    // Elemento en el que se escribe el comando introducido para que el usuario lo pueda visualizar
            this.X_COMANDO + 15, this.Y_COMANDO,
            ''
        )

    }

    config_eventos_teclado(){
     
        this.input.keyboard.on('keydown', (tecla) => {
            //console.log('Tecla presionada:', tecla.key, 'Código:', tecla.code)

            if(tecla.code === 'Backspace'){     // Borrar caracter
                if(this._comandoActual.length > 0){
                    this._comandoActual = this._comandoActual.slice(0, -1)
                    this._comandoActualText.setText(this._comandoActual)
                }
            }
            else if(tecla.code === 'Enter'){    // Mandar comando
                this.ejecutar_comando(this._comandoActual.toLowerCase())
                this._comandoActual = ''
                this._comandoActualText.setText(this._comandoActual)
            }
            else if(tecla.code === 'Space'){    // Espacios
                this._comandoActual += ' '
                this._comandoActualText.setText(this._comandoActual)
            }
            else if(/^[a-zA-Z0-9-]$/.test(tecla.key)){   // Solo letras y numeros
                this._comandoActual += tecla.key
                this._comandoActualText.setText(this._comandoActual)
            }
        })
    }

    ejecutar_comando(comandoActual){

        if(comandoActual == '')
            return


        const comandoCompleto = comandoActual.split(' ')
        const comando = comandoCompleto[0]
        const parametros = comandoCompleto.slice(1)

        console.log(comando)
        console.log(parametros)

        this._historialComandos.push(comandoActual) // Guardar comando ejecutado

        switch(comando){

        case 'exit':    // Salir de la tienda
            this._storeElements.forEach( element => {
                element.destroy()               // Eliminar todo lo incluido a la escena
            })

            this._historialComandos = []        // Eliminar historial de comandos
            this._comandoActualText.destroy()   // Eliminar texto de comando

            // Reanudar escena anterior
            this.scene.pause(this.scene.key)
            this.scene.resume(this._previousScene, null)
            return

        case 'help':    // Ver ayuda
            
            return

        case '':
        default:
            console.log('Comando no encontrado')
            return
        }
    }

    update(){}

}