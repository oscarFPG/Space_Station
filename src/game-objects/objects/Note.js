import Phaser from 'phaser'
import Object from '../base-game-objects/Object'


export default class Note extends Object {
  
	static TEXTURE = 'note'
	static TEXT = '2025'
	static AUTO_CLOSING_TIME = 3000


	constructor(scene, x, y, text) {
		super(scene, x, y, Note.TEXTURE)
		this.body.setSize(90, 90)
		this.body.setOffset(15, 15)

		// Bandera para saber si la ventana ya está abierta
		this.windowOpen = false

		// Referencia a los elementos de la ventana
		this.noteElements = null

		this._displayHelperText = true
		this._interactiveDistance = 110
		this._noteText = text
	}

	player_overlaps(player){
		this.accion(player)
	}

	accion(player) {

		if(!player.isUseKeyJustPressed())
			return

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
			this._noteText,
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

		this.noteElements.forEach(el => el.destroy())
		this.noteElements = null
		this.windowOpen = false
	}

}