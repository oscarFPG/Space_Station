import Phaser from 'phaser'
import Object from '../base-game-objects/Object'

export default class BatteryStructure extends Object {

	static TEXTURE = 'batteryStructure'
	
	constructor(scene, x, y, doorsID, numBaterias) {
		super(scene, x, y, BatteryStructure.TEXTURE)
		this.body.setSize(160, 160)
		this.body.setOffset(-10, -20)

		this.windowOpen = false
		this.noteElements = null
		this.delayedClose = null
		this._displayHelperText = true
		this._interactiveDistance = 150
		this._offsetX = -40
		this._offsetY = 80

		this._doorsID = doorsID
		this._numBateriasActuales = 0
		this._numBaterias = numBaterias
	}


	accion(player){
		
		if(!player.isUseKeyJustPressed())
			return

		if(this.windowOpen)
			this.closeNoteWindow()

		const bateriasJugador = player.getBatteries()
		this.mostrarVentana(player, bateriasJugador)
	}

	mostrarVentana(player, bateriasJugador){

		if(bateriasJugador > 0){
			this._numBateriasActuales += bateriasJugador
			player.quitar_baterias(bateriasJugador)
			console.log(`QUITANDO ${bateriasJugador} BATERIAS AL JUGADOR`)
		}

		if(this.noteElements == null){
			this.noteElements = this.crearVentana()
			this.noteElements.setVisible(true)
		}
		else{
			this.noteElements.destroy()
			this.noteElements = null
		}
		
	}

	crearVentana(){

		console.log('VENTANA ABIERTA')
		const windowX = this.x
		const windowY = this.y

		const stateMessage = `${this._numBateriasActuales} / ${this._numBaterias} CELLS`
		const stateText = this.scene.add.text(windowX, windowY, stateMessage, {
			fontSize: '18px',
			fill: '#fff',
			wordWrap: { width: 250 }
		})
		stateText.setOrigin(0.5)

		return stateText
	}

	activateAction(player) {

		let actionText
		let playerCells = this._player.getBatteries()
		if (playerCells > 0) {
			const actionMessage = `INSERT ${playerCells} CELLS [E]`
			actionText = this.scene.add.text(windowX, windowY + 20, actionMessage, {
			fontSize: '17px',
			fill: '#ff0',
			wordWrap: { width: 250 }
			})
			actionText.setOrigin(0.5)
			
			this.qKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
			
			// Revisamos de forma periódica si se presiona la tecla Q
			this.delayedCheck = this.scene.time.addEvent({
			delay: 100,
			callback: () => {
				if (this.qKey.isDown) {
				const cellsToTransfer = this._player.getBatteries()
				this._player.vaciarBaterias()
				this._batteries += cellsToTransfer
				// Actualizamos el mensaje de estado
				stateText.setText(`${this._batteries} / ${this._remainingBatteries} CELLS`)
				if (this._batteries === this._remainingBatteries) {
					this.setVisible(false)
					this.light.setColor(0x8888ff)
					this._doors.forEach(_door => {
					if(!_door.getIsActivate())
						_door.activateDoor()
					})
				}
				// También se puede actualizar el mensaje de acción para indicar que ya no hay cells
				actionText.setText(`Cells inserted!!!`)
				// Detenemos la comprobación periódica
				this.delayedCheck.remove()
				}
			},
			loop: true
			})
		}
		
		this.noteElements = [stateText]
		if (actionText) {
			this.noteElements.push(actionText)
		}
		this.delayedClose = this.scene.time.delayedCall(2500, () => {
			this.closeNoteWindow()
		})
	}

	closeNoteWindow() {

		if (this.delayedCheck) {
			this.delayedCheck.remove()
			this.delayedCheck = null
		}
		if (this.noteElements) {
			this.noteElements.forEach(el => el.destroy())
			this.noteElements = null
		}
		if (this.delayedClose) {
			this.delayedClose.remove()
			this.delayedClose = null
		}

		this.windowOpen = false
	}

}
