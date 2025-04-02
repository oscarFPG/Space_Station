import Phaser from 'phaser';
import Object from '../base-game-objects/Object';


export default class Console extends Object {

	static TEXTURE = 'consoleBlocked'

	constructor(scene, x, y, password, laserID) {
		super(scene, x, y, Console.TEXTURE);
		this.body.setSize(150, 150);
		this.body.setOffset(-20, -15);

		// Bandera para controlar si la ventana de la consola está abierta
		this.windowOpen = false;

		// Aquí se almacenarán los elementos creados para la ventana
		this.consoleElements = null;

		// Flag para evitar la apertura de la consola si ya ha sido utilizada con éxito
		this._successfullUsed = false

		this._displayHelperText = true
		this._interactiveDistance = 130
		this._password = password
		this._laserId = laserID
	}


	preUpdate() {

		if(this._successfullUsed)
			return

		const player = this.scene.get_player()
		if(!player || !this._displayHelperText)
			return


		const distance = Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y)
		if(distance < this._interactiveDistance){
			this._textoInteraccion.setVisible(true)
			this._textoInteraccion.setPosition(this.x + this._offsetX, this.y + this._offsetY)
		}	
		else{
			this._textoInteraccion.setVisible(false)
		}

	}

	player_overlaps(player){

		if(this._successfullUsed)
			return

		if(player.isUseKeyJustPressed())
			this.accion(player)
	}

	accion(player){

		if(this.windowOpen){
			this.windowOpen = false
			this.closeConsoleWindow(player)
		}
		else
			this.openConsoleWindow(player)
	}
  
	openConsoleWindow(player) {
	
		player.set_player_activo(false)
		this.windowOpen = !this.windowOpen
		let enteredPassword = "";
		const elements = []

		const openSound = this.scene.sound.add('console_sound');
		openSound.setVolume(1.5);  // Ajusta el volumen según prefieras
		openSound.play();
	
		const overlay = this.scene.add
			.rectangle(
			0, 0,
			this.scene.cameras.main.width,
			this.scene.cameras.main.height,
			0x000000,
			0
			)
			.setOrigin(0)
			.setInteractive()
		elements.push(overlay)

		const panelX = this.x + 100;
		const panelY = this.y - 100;

		const panelBg = this.scene.add
			.rectangle(panelX, panelY, 300, 250, 0x000000, 0.8)
			.setOrigin(0.5)
			.setDepth(1);
		elements.push(panelBg)

		const passwordDisplay = this.scene.add
			.text(panelX, panelY - 80, '', { fontSize: '20px', fill: '#fff' })
			.setOrigin(0.5)
			.setDepth(1);
		elements.push(passwordDisplay)

		// Botón de cierre (X) en la parte superior derecha del panel
		const closeBtn = this.scene.add
			.text(panelX + 120, panelY - 100, 'X', {
			fontSize: '24px',
			fill: '#fff',
			backgroundColor: '#aa0000'
			})
			.setPadding(5)
			.setOrigin(0.5)
			.setInteractive()
			.setDepth(1)
			.on('pointerdown', () => {
			this.closeConsoleWindow(player);
			});
		elements.push(closeBtn)

		// Definir las posiciones de los botones numéricos
		const keys = [
			{ label: '1', x: panelX - 50, y: panelY - 20 },
			{ label: '2', x: panelX,      y: panelY - 20 },
			{ label: '3', x: panelX + 50, y: panelY - 20 },
			{ label: '4', x: panelX - 50, y: panelY + 20 },
			{ label: '5', x: panelX,      y: panelY + 20 },
			{ label: '6', x: panelX + 50, y: panelY + 20 },
			{ label: '7', x: panelX - 50, y: panelY + 60 },
			{ label: '8', x: panelX,      y: panelY + 60 },
			{ label: '9', x: panelX + 50, y: panelY + 60 },
			{ label: '0', x: panelX,      y: panelY + 100 }
		];

		// Crear los botones numéricos
		keys.forEach(key => {
			const btn = this.scene.add
			.text(key.x, key.y, key.label, {
				fontSize: '24px',
				fill: '#fff',
				backgroundColor: '#333'
			})
			.setPadding(10)
			.setOrigin(0.5)
			.setInteractive()
			.setDepth(1)
			.on('pointerdown', () => {
				//poner la musica
				const ClickSOund = this.scene.sound.add('ClickSOund');
				ClickSOund.setVolume(4);  // Ajusta el volumen del sonido
				ClickSOund.play();
				if(enteredPassword.length < 4){
					enteredPassword += key.label
					passwordDisplay.setText(enteredPassword)
				}
				
			})

			elements.push(btn)
		})

		// Botón para borrar la entrada
		const clearBtn = this.scene.add
			.text(panelX - 50, panelY + 140, 'Delete', {
			fontSize: '20px',
			fill: '#fff',
			backgroundColor: '#aa0000'
			})
			.setPadding(10)
			.setOrigin(0.5)
			.setInteractive()
			.setDepth(1)
			.on('pointerdown', () => {
				enteredPassword = "";
				passwordDisplay.setText('');
			});
		elements.push(clearBtn);

		// Botón para confirmar la entrada
		const enterBtn = this.scene.add
			.text(panelX + 50, panelY + 140, 'Enter', {
			fontSize: '20px',
			fill: '#fff',
			backgroundColor: '#00aa00'
			})
			.setPadding(10)
			.setOrigin(0.5)
			.setInteractive()
			.setDepth(1)
			.on('pointerdown', () => {
				/*this._secret_sound = this.sound.add('secret_code');
				this._secret_sound.setVolume(0,2);
				this._secret_sound.play();*/
				if (enteredPassword === this._password) {

					// Contraseña correcta: Desactivar los láseres y ocultar la consola
					this.acierto = this.scene.sound.add('success');
					this.acierto.setVolume(2);
					this.acierto.play();

					// Desactivar todos los laseres asociados a esta consola
					this.desactivar_laseres()
					
					this._successfullUsed = true
					this.setVisible(false);
					this._textoInteraccion.setVisible(false);
					this.closeConsoleWindow(player);
				} else {

					// Contraseña incorrecta: Mostrar mensaje y reiniciar entrada
					const errorSound= this.scene.sound.add('error');
					errorSound.setVolume(2);
					errorSound.play();
					
					passwordDisplay.setText('Contraseña incorrecta');
					enteredPassword = "";
					this.scene.time.delayedCall(1000, () => {
				
					if (passwordDisplay && passwordDisplay.active) {
						passwordDisplay.setText('');
					}
					});          
				}
			});
		elements.push(enterBtn);

		// Guardar la referencia de los elementos para poder destruirlos cuando se cierre la ventana
		this.consoleElements = elements;
	}

	closeConsoleWindow(player) {

		if (this.consoleElements) {
			this.consoleElements.forEach(el => el.destroy());
			this.consoleElements = null;
		}
		this.windowOpen = false;
		this.scene.consoleActive = false; 
		this.scene.time.delayedCall(200, () => {
			player.set_player_activo(true)
		})
	}

	desactivar_laseres(){
		this.scene.desactivar_laseres(this._laserId)
	}

}
