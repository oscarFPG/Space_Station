import Phaser from 'phaser';

export default class Console extends Phaser.GameObjects.Sprite {

	constructor(scene, x, y, sprite) {
		super(scene, x, y, sprite); 
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);

		this.body.setSize(150, 150);
		this.body.setOffset(-20, -15);
		
		this.interactionText = scene.add.text(x, y - 50, 'Interact [E]', { 
			fontSize: '16px', 
			fill: '#fff',
			backgroundColor: 'rgba(0, 0, 0, 0.5)'
		});
		this.interactionText.setPipeline('Light2D');
		this.interactionText.setVisible(false);

		// Bandera para controlar si la ventana de la consola está abierta
		this.windowOpen = false;
		// Aquí se almacenarán los elementos creados para la ventana
		this.consoleElements = null;
	}

	configure(player, lasers) {
		this.lasers = lasers;
		this.player = player;
		this.interactionText.setPosition(this.x, this.y - 50);
		this.body.allowGravity = false;
		this.light = this.scene.lights.addLight(this.x, this.y, 150, 0xffffff, 1);
		this.eKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
		
	}

	update() {

		if (this.windowOpen && (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0)) {
			this.closeConsoleWindow();
			return;
		}

		if (Phaser.Math.Distance.Between(this.x - 35, this.y, this.player.x, this.player.y) > 130) {
			this.interactionText.setVisible(false);
		}
		else {
			this.interactionText.setVisible(true);
			if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
				if (this.windowOpen) {
					this.closeConsoleWindow();
				} else {
					const consoleSound= this.scene.sound.add('console_sound');
					consoleSound.setVolume(2);  // Ajusta el volumen del sonido
					consoleSound.play();
					this.openConsoleWindow();
				}
			}
		}
	}
  

	openConsoleWindow() {
		
		this.player.setIsConsoleActive(true);
		this.windowOpen = true;
		this.scene.consoleActive = true; 

		const overlay = this.scene.add
			.rectangle(
			0, 0,
			this.scene.cameras.main.width,
			this.scene.cameras.main.height,
			0x000000,
			0
			)
			.setOrigin(0)
			.setInteractive();

		const panelX = this.x + 100;
		const panelY = this.y - 100;

		const panelBg = this.scene.add
			.rectangle(panelX, panelY, 300, 250, 0x000000, 0.8)
			.setOrigin(0.5)
			.setDepth(1);

		const passwordDisplay = this.scene.add
			.text(panelX, panelY - 80, '', { fontSize: '20px', fill: '#fff' })
			.setOrigin(0.5)
			.setDepth(1);

		const correctPassword = this.data.values.password || this.data.values.Contraseña;
		let enteredPassword = "";

		// Almacenar los elementos en un arreglo para poder destruirlos luego
		const elements = [overlay, panelBg, passwordDisplay];

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
			this.closeConsoleWindow();
			});
		elements.push(closeBtn);

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
				enteredPassword += key.label;
				passwordDisplay.setText(enteredPassword);
			});
			elements.push(btn);
		});
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
				if (enteredPassword === correctPassword) {
					// Contraseña correcta: Desactivar los láseres y ocultar la consola
					this.lasers.forEach(laser => {
						if(laser.getIsStoppable())
							laser.desactivateLaser()
					});
					this.setVisible(false);
					this.interactionText.setVisible(false);
					this.closeConsoleWindow();
				} else {
					// Contraseña incorrecta: Mostrar mensaje y reiniciar entrada
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

	closeConsoleWindow() {

		if (this.consoleElements) {
			this.consoleElements.forEach(el => el.destroy());
			this.consoleElements = null;
		}
		this.windowOpen = false;
		this.scene.consoleActive = false; 
		this.scene.time.delayedCall(200, () => {
			this.player.setIsConsoleActive(false);
		});
	}
}
