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


    _contadorComandos
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

        this._contadorComandos = 0
    }
    
    init(data) {
        this._previousScene = data.previousScene
        this._monedas = data.playerData.monedas
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
        this._historialComandos.push( mensajeAyuda )

        const guiaComando = this.add.text(          // Simbolo para indicar donde aparece el comando introducido
            this.X_COMANDO, this.Y_COMANDO,
            '>'
        )
        this._storeElements.push( guiaComando )

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

        this.addTextToConsole(comandoActual)
        
        switch(comando){
        case 'exit':    // Salir de la tienda
            this.exit()
            return

        case 'help':    // Ver ayuda
            this.mensaje_ayuda()
            return
        
        case 'money':
            this.consultar_dinero()
            return

        case 'catalog':
            this.consultar_catalogo()
            return

        case 'buy':   
            this.comprar_objetos(parametros)
            return

        case 'clear':
            this.limpiar_terminal()
            return

        case '':
        default:
            this.addTextToConsole(`No se ha encontrado el comando '${comandoActual}'`)
            return
        }
    }

    // Metodos para cada tipo de comando
    exit(){

        this._storeElements.forEach(element => {
            element.destroy()               // Eliminar todo lo incluido a la escena
        })

        this.limpiar_terminal()
        this._comandoActualText.destroy()   // Eliminar texto de comando

        // Reanudar escena anterior
        this.scene.pause(this.scene.key)
        this.scene.resume(this._previousScene, null)
    }

    mensaje_ayuda(){

        const message = []
        message.push("Puedes ejecutar los siguientes comandos:")
        message.push("'buy -nombre' : para comprar el objeto 'nombre'")
        message.push("'exit' : para salir de la tienda")
        message.push("'money' : para consultar cuantas monedas tienes")
        message.push("'catalog' : para ver que productos puedes comprar")
        message.push("'clear' : para limpiar el terminal")

        message.forEach(m => {
            this.addTextToConsole(m)
        })
    }

    consultar_dinero(){
        this.addTextToConsole(`Tienes ${this._monedas}$ disponibles!`)
    }

    consultar_catalogo(){

        const message = []
        message.push("Objeto -- Precio -- Descripcion")
        message.push("Vida   --   50   -- Objeto para recuperar puntos de vida")
        message.push("Escudo --   30   -- Objeto para recuperar escudo")

        message.forEach(m => {
            this.addTextToConsole(m)
        })
    }

    comprar_objetos(objetos){

        var hayArticulo = false
        objetos.forEach(obj => {
            
            hayArticulo = true
            switch(obj){
            case '-v':
            case '-vida':
                this.addTextToConsole(`Has comprado una cura de 20 puntos de vida por ${50}$`)
                break

            case '-e':
            case '-escudo':
                this.addTextToConsole(`Has comprado una cura de 20 puntos de escudo por ${30}$`)
                break

            default:
                this.addTextToConsole('No se encontró el articulo para comprar')
                break
            }
        })

        if(!hayArticulo)
            this.addTextToConsole('Especifique un articulo para comprar')
    }

    limpiar_terminal(){

        this._historialComandos.forEach(command => {
            command.destroy()
        })
        this._historialComandos = []

    }
    // Metodos para cada tipo de comando

    addTextToConsole(command){

        if(this._historialComandos.length != 23){   // Evitar que nuevos comandos se salgan de la terminal

            this._historialComandos.forEach(comando => {
                comando.setPosition(comando.x, comando.y - this.ESPACIO_ENTRE_LINEA)
            })
    
            const comandoText = this.add.text(
                this.X_COMANDO, 
                this.Y_COMANDO - this.ESPACIO_ENTRE_LINEA, 
                command
            )
            this._historialComandos.push(comandoText)
        }
    }

    update(){}

}