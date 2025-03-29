import Phaser from 'phaser'
import Object from '../base-game-objects/Object'

export default class BatteryStructure extends Object {

	

	constructor(scene, x, y, sprite) {
		super(scene, x, y, sprite)
		this.body.setSize(150, 150)
		this.body.setOffset(10, 10)

		this.windowOpen = false
		this.noteElements = null

		this.delayedClose = null
		this._batteries = 0
		this.minimumDistance = 100
	}

	player_overlaps(player){
		// FUNCION QUE SE EJECUTA CONTINUAMENTE MIENTRAS EL JUGADOR HAGA OVERLAP
	}

	accion(){
		// FUNCION QUE SE EJECUTA CUANDO EL JUGADOR HACE OVERLAP Y PULSA LA TECLA DE 'USAR'
	}

	activateAction() {

		if (this.windowOpen) {
			this.closeNoteWindow()
			return
		}
		this._remainingBatteries = this.data.values.numBatteries
		this.windowOpen = true
		const windowX = this.x
		const windowY = this.y - 100
		
		const stateMessage = `${this._batteries} / ${this._remainingBatteries} CELLS`
		const stateText = this.scene.add.text(windowX, windowY - 20, stateMessage, {
			fontSize: '18px',
			fill: '#fff',
			wordWrap: { width: 250 }
		})
		stateText.setOrigin(0.5)
		
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
		this.windowOpen = false
		if (this.delayedClose) {
			this.delayedClose.remove()
			this.delayedClose = null
		}
	}

}
