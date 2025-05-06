import Phaser from 'phaser'
import Object from '../base-game-objects/Object'
import Builder from '../../managers/Builder'
import Options from '../../managers/Options.js';


export default class Note extends Object {
  
	static AUTO_CLOSING_TIME = 4000


	constructor(scene, x, y, text) {
		super(scene, x, y, Builder.OBJ_NOTA, true)
		this.body.setSize(90, 90)
		this.body.setOffset(15, 15)
		this.light = this.scene.lights.addLight(this.x, this.y, 300, 0xffffff, 0.7)

		// Bandera para saber si la ventana ya está abierta
		this.windowOpen = false

		// Referencia a los elementos de la ventana
		this.noteElements = null

		this._displayHelperText = true
		this._interactiveDistance = 110
		this._noteText = text
	}

	accion(player) {

		if(!player.isUseKeyJustPressed())
			return
		
		this.removeLight();
		this.windowOpen = !this.windowOpen	// Alternar accion abrir/cerrar ventana
		if(!this.windowOpen){
			this.closeNoteWindow()
			return
		}
		
		const options = Options.get_instance();
		options.playSound(this.scene, 'activate_note', { isMusic: false, volume: 1.0 });

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
		this.scene.uiLayer.add(this.noteElements);
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
	getIsInteractive() { return true}
}