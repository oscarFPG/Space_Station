import Phaser from 'phaser'
import Object from '../base-game-objects/Object'
import Options from '../../managers/Options.js';

export default class BatteryStructure extends Object {

	static TEXTURE_ON_LOW = 'batteryStructLow'
	static TEXTURE_ON_FULL = 'batteryStructLFull'
	static OPENING_TIME = 2000

	constructor(scene, x, y, doorsID, numBaterias) {
		super(scene, x, y, BatteryStructure.TEXTURE_ON_LOW, false)
		this.body.setSize(160, 160)
		this.body.setOffset(-10, -20)

		this.windowOpen = false
		this.noteElements = null
		this.delayedClose = null
		this._displayHelperText = false
		this._interactiveDistance = 165
		this._offsetX = -40
		this._offsetY = 80

		this._doorsID = doorsID
		this._alreadyCompleted = false
		this._numBateriasActuales = 0
		this._numBaterias = numBaterias
	}


	accion(player){
		
		//if(!player.isUseKeyJustPressed())
		//	return

		if(this.windowOpen)
			this.closeNoteWindow()

		const bateriasJugador = player.getBatteries()
		this.mostrarVentana(player, bateriasJugador)
	}

	mostrarVentana(player, bateriasJugador){

		this.windowOpen = !this.windowOpen
		
		if(bateriasJugador > 0){
			this._numBateriasActuales += bateriasJugador
			player.quitar_baterias(bateriasJugador)
		}

		if(!this._alreadyCompleted && this._numBateriasActuales == this._numBaterias){
			this._alreadyCompleted = true
			const options = Options.get_instance();
			options.playSound(this.scene, 'success', { isMusic: false, volume: 1.0 });
			this.activarObjetos(this._doorsID)
			return;
		}

		if(this.noteElements == null){
			this.noteElements = this.crearVentana()
			this.noteElements.setVisible(true)
			this.delayedClose = this.scene.time.delayedCall(BatteryStructure.OPENING_TIME, () => { this.closeNoteWindow() }, null, () => { this.restart_timer() })
		}
		else{
			this.noteElements.destroy()
			this.noteElements = null
		}
	}

	crearVentana(){

		const windowX = this.x + 10
		const windowY = this.y - 75
		const stateMessage = `${this._numBateriasActuales} / ${this._numBaterias} CELLS`
		const stateText = this.scene.add.text(windowX, windowY, stateMessage, {
			fontSize: '18px',
			fill: '#fff',
			wordWrap: { width: 250 }
		})
		stateText.setOrigin(0.5)

		return stateText
	}

	closeNoteWindow() {

		if (this.noteElements) {
			this.noteElements.destroy()
			this.noteElements = null
		}
		if (this.delayedClose) {
			this.delayedClose.remove()
			this.delayedClose = null
		}

		this.windowOpen = false
	}

	activarObjetos(doorID){
		this.scene.activar_puertas(doorID)
		this.destroyObject()
	}

	destroyObject(){
		this.closeNoteWindow()
		this.destroy()
	}

	restart_timer(){
		this.delayedClose.remove()
		this.delayedClose = null
	}
}
