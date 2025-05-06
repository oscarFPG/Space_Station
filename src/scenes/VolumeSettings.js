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

		// Crear el fondo
		this.createBackground(width, height);

		// Crear panel
		const panel = this.createPanel(width, height);

		// Crear el título
		this.createTitle(width, panel.y);

		// Crear los botones de volumen
		this.createVolumeButtons(width, panel.y);

		// Crear botón "Volver"
		this.createBackButton(width / 2, panel.y + panel.height - 20);

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
		const panelH = 270;//Altura del Panel
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
		const startY = panelY + 80;
		const spacing = 60;
	
		const sliders = [
			{ type: 'general', label: 'Volumen General', value: options.get_volumen_general() },
			{ type: 'musica', label: 'Volumen Música', value: options.get_volumen_musica() },
			{ type: 'efectos', label: 'Efectos de Sonido', value: options.get_volumen_efectos_sonido() }
		];
	
		sliders.forEach((opt, i) => {
			const label = this.add.text(width / 2, startY + i * spacing - 20, opt.label, {
				fontSize: '20px',
				color: '#ffffff'
			}).setOrigin(0.5);
			
			this.createSlider(width / 2, startY + i * spacing, opt.type, opt.value);
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
	//funcion para crear la barra y la bolita
	createSlider(x,y,type,valorActual){
		const options = Options.get_instance();
		const barWidth = 200;
		const barHeight= 6;
		const ballRadio=10;
		//creo el rectangulo
		const bar= this.add.rectangle(x,y,barWidth,barHeight,0xffffff).setOrigin(0.5,0.5);

		//posicion de la bola segun el parametro de volumen actual que paso
		const ballX = x - barWidth / 2 + valorActual * barWidth;
		//creo la bolita
		/*en este paso es muu importante porque hago que sea interactiva la pelota, y anyado la opcion de que sea "draggeable" 
		para que se pueda arrastrar despues*/
		const ball =this.add.circle(x - barWidth / 2 + barWidth * valorActual, y, ballRadio, 0x7DF9FF).setInteractive({ useHandCursor: true, draggable: true });
		// Crear texto de porcentaje
		const percentText = this.add.text(x + barWidth / 2 + 10, y, `${Math.round(valorActual * 100)}%`, {
		fontSize: '18px',
		color: '#ffffff'
	}).setOrigin(0, 0.5); // izquierda centrado verticalmente
		
		ball.on('drag', (pointer, dragX) => {
			const minX = x - barWidth / 2;
			const maxX = x + barWidth / 2;
			const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
			ball.x = clampedX;

			// Calcular nuevo valor y actualizar
			const newValue = (clampedX - minX) / barWidth;

			// Actualizar el texto tambien en proporcion al porcentaje
			percentText.setText(`${Math.round(newValue * 100)}%`);

			// Aplicar cambio según tipo
			const options = Options.get_instance();
			switch (type) {
				case 'general':
					options.cambiar_volumen_general(newValue);
					break;
				case 'musica':
					options.cambiar_volumen_musica(newValue);
					break;
				case 'efectos':
					options.cambiar_volumen_efectos(newValue);
					break;
			}
		});
	}
}
