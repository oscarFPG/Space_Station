import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import Options from '../managers/Options.js'

export default class VolumeSettings extends BaseScene {

	constructor() {
		super('volumeSettings');
	}

	init(data) {
		this._previousScene = data.previousScene || 'GameScene';
	}

	create() {
		const { width, height } = this.scale;

		this.input.mouse.disableContextMenu(); // esto lo he puesto porque al darle click derecho me abria cosas del navegador

		// Crear el fondo
		this.createBackground(width, height);

		// Crear panel
		const panel = this.createPanel(width, height);

		// Crear el título
		this.createTitle(width, panel.y);

		// Crear los botones de volumen
		this.createVolumeButtons(width, panel.y);

		// Crear botón "Volver"
		this.createBackButton(panel.x + panel.width / 2, panel.y + panel.height - 20);

		// Crear botón "Guardar" (comentado para futuro)
		/*this.createSaveButton(panel.x + panel.width - 20, panel.y + panel.height - 20);*/

		// esto es para que cuando este en VolumeSettings pueda salir con los cambios guardados directamente presionando "ESC"
		this.input.keyboard.on(Options.TECLA_PAUSA, () => {
			this.scene.stop();
			this.scene.stop('settings');
			this.scene.resume(this._previousScene);
		}, this);
	}

	// Se agrega un rectángulo con un poco de opacidad sobre toda la pantalla
	createBackground(width, height) {
		this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0);
	}

	// Panel central donde estarán los controles de volumen
	createPanel(width, height) {
		const panelW = 360;//Ancho del Panel
		const panelH = 240;//Altura del Panel
		const panelX = (width - panelW) / 2;
		const panelY = (height - panelH) / 2;

		this.add.rectangle(panelX, panelY, panelW, panelH, 0x222222, 0.9)
			.setOrigin(0)
			.setStrokeStyle(4, 0x7DF9FF);// Borde del panel con color azul

		return { x: panelX, y: panelY, width: panelW, height: panelH };
	}

	// Función para Volumen
	createTitle(width, panelY) {
		this.add.text(width / 2, panelY + 30, 'Volumen', {
			fontSize: '32px',
			color: '#7DF9FF'
		}).setOrigin(0.5);
	}

	// Función para crear los botones de volumen
	createVolumeButtons(width, panelY) {
		const options = Options.get_instance();

		const opciones = [
			{ text: `Volumen General: ${Math.round(options.get_volumen_general() * 100)}%`, action: 'general' },
			{ text: `Volumen Música: ${Math.round(options.get_volumen_musica() * 100)}%`, action: 'musica' },
			{ text: `Efectos de Sonido: ${Math.round(options.get_volumen_efectos_sonido() * 100)}%`, action: 'efectos' }
		];

		const startY = panelY + 80;
		const spacing = 45;

		opciones.forEach((opt, i) => {
			this.createVolumeButton(width, startY + i * spacing, opt);
		});
	}

	// Función para crear un solo botón de volumen
	createVolumeButton(width, y, opt) {
		const btn = this.add.text(width / 2, y, opt.text, {
			fontSize: '24px',
			color: '#ffffff'
		}).setOrigin(0.5)
			.setInteractive({ useHandCursor: true })
			.on('pointerover', () => btn.setColor('#7DF9FF'))
			.on('pointerout', () => btn.setColor('#ffffff'))
			.on('pointerdown', (pointer) => {
                //he agregado esto para hacer que cuando pulse boton click izquierdo y derecho hagan cosas distintas
				if (pointer.button === 0) {//click izquierdo suma
					this.onVolumeChange(opt.action, +0.1);
				} else if (pointer.button === 2) {//click derecho resta
					this.onVolumeChange(opt.action, -0.1);
				}
		    });
	}

	// Función para crear el botón "Volver"
	createBackButton(x, y) {
		const backBtn = this.add.text(x, y, 'Volver', {
			fontSize: '20px',
			color: '#7DF9FF'
		})
			.setOrigin(0.5, 1)
			.setInteractive({ useHandCursor: true })
			.on('pointerover', () => backBtn.setColor('#ffffff'))
			.on('pointerout', () => backBtn.setColor('#7DF9FF'))
			.on('pointerdown', () => {
				this.scene.stop(); // Cerramos VolumeSettings
				this.scene.launch('settings', { previousScene: this._previousScene }); // Reabrir ajustes
			});
	}

	// Función para crear el botón "Guardar" (comentado para futuro)
	/*createSaveButton(x, y) {
		const saveBtn = this.add.text(x, y, 'Guardar', {
			fontSize: '20px',
			color: '#7DF9FF'
		})
			.setOrigin(1, 1)
			.setInteractive({ useHandCursor: true })
			.on('pointerover', () => saveBtn.setColor('#ffffff'))
			.on('pointerout', () => saveBtn.setColor('#7DF9FF'))
			.on('pointerdown', () => {
				console.log('Cambios guardados');
				// añadir lógica para guardar cambios
			});
	}*/

	// Función para cambiar el volumen
	onVolumeChange(type, botonIzDer) { //ahora le tengo que pasar el delta
		const options = Options.get_instance();
		switch (type) {
			case 'general':
				let newGeneralVolume = options.get_volumen_general() + botonIzDer;
				newGeneralVolume = Phaser.Math.Clamp(newGeneralVolume, 0, 1);/*esta funcion solamente hace que no pase tanto por arriba
                como por abajo, por ejemplo no puedo poner un volumen negativo, y tampoco puedo poner un volumen de mas del 100% */
				options.cambiar_volumen_general(newGeneralVolume);
				break;
			case 'musica':
				let newMusicVolume = options.get_volumen_musica() + botonIzDer;
				newMusicVolume = Phaser.Math.Clamp(newMusicVolume, 0, 1);
				options.cambiar_volumen_musica(newMusicVolume);
				break;
			case 'efectos':
				let newEfectoVolume = options.get_volumen_efectos_sonido() + botonIzDer;
				newEfectoVolume = Phaser.Math.Clamp(newEfectoVolume, 0, 1);
				options.cambiar_volumen_efectos(newEfectoVolume);
				break;
			default:
				break;
		}
		this.scene.restart(); // Para que los cambios se reflejen inmediatamente
	}
}
