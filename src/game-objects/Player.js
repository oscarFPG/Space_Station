import Phaser from 'phaser';
import BasePistol from './weapons/BasePistol';


export default class Player extends Phaser.GameObjects.Container {
	
	// Player animation names
	static IDLE_ANIMATION = 'playerIdle';
	static RUNNING_ANIMATION = 'playerRunning';

	constructor(scene, x, y) {

		super(scene, x, y);
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);
		this.player = scene.add.sprite(32, 54, Player.IDLE_ANIMATION).setOrigin(0.5, 0.5);
		this.body.setSize(100, 130);

		// Configuracion de controles, animaciones, iluminacion y del arma
		this.#config_controles();
		this.#config_arma();
		this.#config_animaciones();
		this.#config_iluminacion();
		
		// Añadir al container
		this.add(this.player);
		this.add(this.weapon);

		// Registra el método update para que se llame en cada frame
		this.scene.events.on('update', this.update, this);

		// Usar el evento 'postupdate' para actualizar el arma después de los cambios de física y render
		this.scene.events.on('postupdate', this.updateWeapon, this);
	}

	update(time, delta) {

		this.setPosition(this.body.x, this.body.y);
		this.body.setVelocity(0);

		const speed = 300;
		let velocityX = 0;
		let velocityY = 0;

		if (this.cursors.up.isDown || this.keys.up.isDown) {
			velocityY = -1;
		}
		if (this.cursors.down.isDown || this.keys.down.isDown) {
			velocityY = 1;
		}
		if (this.cursors.left.isDown || this.keys.left.isDown) {
			velocityX = -1;
			this.player.setFlipX(true);
			this.player.setX(50);
		}
		if (this.cursors.right.isDown || this.keys.right.isDown) {
			velocityX = 1;
			this.player.setFlipX(false);
		}
		// Normalizar la velocidad para que no sea mayor en diagonal
		if (velocityX !== 0 || velocityY !== 0) {
			const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
			velocityX /= length;
			velocityY /= length;
		}

		this.body.setVelocityX(velocityX * speed);
		this.body.setVelocityY(velocityY * speed);

		// Actualizar animación según movimiento
		if (velocityX !== 0 || velocityY !== 0) {
			if (this.player.anims.currentAnim.key !== "running") {
				this.player.play("running");
			}
		} else {
			if (this.player.anims.currentAnim.key !== "idle") {
				this.player.play("idle");
			}
		}
		let offsetX = 75; // Valor por defecto para cuando no está volteado
		if (this.player.flipX) {
			offsetX = -15; // Si está volteado, la luz se mueve al otro lado
		}
		// Actualizar la posición de la luz con el offset correspondiente
		this.light.setPosition(this.x + offsetX, this.y);
	}

	#config_controles(){

		// Controles de teclado
		this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.keys = this.scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D
		});

		// Controles de raton
		this.scene.input.on('pointerdown', (pointer) =>{
			this.weapon.shot(pointer.worldX, pointer.worldY);
        }, this);
	}

	#config_arma(){

		this.weaponOffset = { x: 65, y: 80 };
		this.weapon = new BasePistol(this.scene, this.weaponOffset.x, this.weaponOffset.y);
		this.weapon.setOrigin(0.5, 0.5); 
	}

	#config_animaciones(){

		this.scene.anims.create({
			key: 'idle',
			frames: this.scene.anims.generateFrameNumbers(Player.IDLE_ANIMATION, { start: 0, end: 2 }),
			frameRate: 6,
			repeat: -1
		});
		
		this.scene.anims.create({
			key: 'running',
			frames: this.scene.anims.generateFrameNumbers(Player.RUNNING_ANIMATION, { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		// Animacion base
		this.player.play('idle');
	}

	#config_iluminacion(){

		// Crear la luz que seguirá al jugador
		this.light = this.scene.lights.addLight(this.x, this.y, 650, 0xffffff, 1.5);
		this.player.setPipeline('Light2D');
		this.weapon.setPipeline('Light2D');
	}

	updateWeapon() {

		const pointer = this.scene.input.activePointer;
		const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);

		// Obtener la posición mundial real del arma:
		const weaponWorldX = this.x + this.weapon.x;
		const weaponWorldY = this.y + this.weapon.y;
		// Calcular el ángulo desde el centro del container hacia el puntero
		let angle = Phaser.Math.Angle.Between(weaponWorldX, weaponWorldY, worldPoint.x, worldPoint.y);
		this.weapon.setRotation(angle);   
		this.weapon.setFlipY(worldPoint.x < weaponWorldX);
	}
	
}