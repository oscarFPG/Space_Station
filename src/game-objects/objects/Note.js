import Phaser from 'phaser'
import Interactive from '../base-game-objects/Interactive.js'

export default class Note extends Interactive {
  
	static TEXT = '2025'
	static AUTO_CLOSING_TIME = 3000

	constructor(scene, x, y, sprite) {
		super(scene, x, y, sprite)
		this.body.setSize(100, 100)

		// Bandera para saber si la ventana ya está abierta
		this.windowOpen = false

		// Referencia a los elementos de la ventana
		this.noteElements = null

		// Referencia al temporizador de cierre automático
		this.delayedClose = null
	}

	accion(player) {

		this.windowOpen = !this.windowOpen	// Alternar accion abrir/cerrar ventana
		if(!this.windowOpen){
			this.closeNoteWindow()
			return
		}
			
		const windowX = this.x + 100
		const windowY = this.y - 100

		// Crear el fondo de la ventana
		const windowBg = this.scene.add.rectangle(
			windowX, windowY, 	// Posicion
			200, 125, 			// Anchura y altura
			0x000000, 0.8		// Color y transparencia
		)

		// Crear el texto de la nota
		const noteText = this.scene.add.text(
			windowX, windowY, 
			Note.TEXT,
			{ fontSize: '14px', fill: '#fff', wordWrap: { width: 200 } }
		)
		noteText.setOrigin(0.5)

		// Guardar llamada de cerrado automatico
		this.delayedClose = this.scene.time.delayedCall(Note.AUTO_CLOSING_TIME, () => {
			this.closeNoteWindow()
		})

		
		this.noteElements = [windowBg, noteText]
	}

	closeNoteWindow() {

		if(!this.noteElements)
			return

		if(this.delayedClose){
			this.delayedClose.remove()
			this.delayedClose = null
		}

		console.log('CERRANDO NOTA')
		this.noteElements.forEach(el => el.destroy())
		this.noteElements = null
		this.windowOpen = false
	}

}