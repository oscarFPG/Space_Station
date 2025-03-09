import Phaser from 'phaser';
import PlayerUI from '../../UI/PlayerUI.js'
import BasePistol from '../weapons/BasePistol.js';

export default class Player extends Phaser.GameObjects.Container {
  
	// Player animation names
	static IDLE_ANIMATION = 'playerIdle';
	static RUNNING_ANIMATION = 'playerRunning';

	static VIDA_INICIAL = 50;
	static ESCUDO_INICIAL = 50;

	constructor(scene, x, y) {

		super(scene, x, y);
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);
		this._player = scene.add.sprite(28, 32, Player.IDLE_ANIMATION).setOrigin(0.5, 0.5);
		this.body.setSize(66, 78);

		// Atributos del jugador
		this._vida = Player.VIDA_INICIAL;
		this._escudo = Player.ESCUDO_INICIAL;

		// Configuracion de controles, animaciones, iluminacion y del arma
		this.#config_controles()
		this.#config_arma()
		this.#config_animaciones()
		this.#config_iluminacion()

		// Registrar los métodos update y postupdate
		this.scene.events.on('update', this.update, this);
		this.scene.events.on('postupdate', this.updateWeapon, this);

		// Bandera para evitar impactos múltiples simultáneos
		this.isImpact = false;

		// Interfaz del personaje
		this._playerUI = new PlayerUI(this.scene, Player.VIDA_INICIAL, Player.ESCUDO_INICIAL);

		// Añadir al container
		this.add(this._player);
		this.add(this.weapon);
	}


	update(time, delta) {

		// Verificar que el body existe antes de acceder a él
		if (!this.body) {
			return;
		}

		// Actualiza la posición del container usando la posición del body
		this.setPosition(this.body.x, this.body.y);
		this.body.setVelocity(0);

		const speed = 180;
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
			this._player.setFlipX(true);
			this._player.setX(34);
		}
		if (this.cursors.right.isDown || this.keys.right.isDown) {
			velocityX = 1;
			this._player.setFlipX(false);
		}
		// Normalizar para que la velocidad no sea mayor en diagonal
		if (velocityX !== 0 || velocityY !== 0) {
			const length = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
			velocityX /= length;
			velocityY /= length;
		}

		this.body.setVelocityX(velocityX * speed);
		this.body.setVelocityY(velocityY * speed);

		// Actualizar animación según el movimiento
		if (velocityX !== 0 || velocityY !== 0) {
			if (this._player.anims.currentAnim.key !== "running") {
				this._player.play("running");
			}
		} else {
			if (this._player.anims.currentAnim.key !== "idle") {
				this._player.play("idle");
			}
		}

		let offsetX = 75; // Valor por defecto para cuando no está volteado
		if (this._player.flipX) {
			offsetX = -15;
		}
		if (this.light) {
			this.light.setPosition(this.x + offsetX, this.y);
		}
	}
  
	receiveDamage(damage) {

		if (this.isImpact)
			return;

		if(this._escudo > 0)
			this.quitar_escudo(damage)
		else
			this.quitar_vida(damage)

		this.isImpact = true;
		this._player.setTintFill(0xffffff);

		if(this._vida > 0) {
			this.scene.time.delayedCall(80, () => {
				this._player.clearTint();
				this.isImpact = false;
			});
		} 
		else {
			this.scene.tweens.add({
				targets: this._player,
				alpha: 0,
				duration: 500,
				onComplete: () => {
				this.scene.scene.restart();
				}
			});
		}

	}

	quitar_escudo(damage){

		if(this._escudo <= 0)
			return;

		this._escudo -= damage;
		this._playerUI.actualizar_escudo(this._escudo);
	}

	quitar_vida(damage){

		if(this._vida <= 0)
			return;

		this._vida -= damage;
		this._playerUI.actualizar_vida(this._vida);
	}

	updateWeapon() {

		// Si this.scene o this.scene.input no existen, no hacer nada.
		if (!this.scene || !this.scene.input) return;

		const pointer = this.scene.input.activePointer;
		if (!pointer) return; // Seguridad extra, en caso de que no exista el puntero.

		const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);

		const weaponWorldX = this.x + this.weapon.x;
		const weaponWorldY = this.y + this.weapon.y;

		let angle = Phaser.Math.Angle.Between(weaponWorldX, weaponWorldY, worldPoint.x, worldPoint.y);
		this.weapon.setRotation(angle);

		// Arma y modelo siempre mirando al mismo lado
		let shouldFlip = worldPoint.x < weaponWorldX
		this.weapon.setFlipY(shouldFlip)
		this._player.setFlipX(shouldFlip)
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

		// Disparo mediante ratón (si la consola no está activa)
		this.scene.input.on('pointerdown', (pointer) => {
			if (this.scene.consoleActive) 
				return;
			this.weapon.shot(pointer.worldX, pointer.worldY);
		}, this);
	}

	#config_arma() {

		this.weaponOffset = { x: 39, y: 54 };
		this.weapon = new BasePistol(this.scene, this.weaponOffset.x, this.weaponOffset.y);
		this.weapon.setOrigin(0.5, 0.5); 
	}

	#config_animaciones() {

		// Crear animación "idle" solo si no existe
		if (!this.scene.anims.exists('idle')) {
			this.scene.anims.create({
				key: 'idle',
				frames: this.scene.anims.generateFrameNumbers(Player.IDLE_ANIMATION, { start: 0, end: 2 }),
				frameRate: 6,
				repeat: -1
			});
		}
		
		// Crear animación "running" solo si no existe
		if (!this.scene.anims.exists('running')) {
			this.scene.anims.create({
				key: 'running',
				frames: this.scene.anims.generateFrameNumbers(Player.RUNNING_ANIMATION, { start: 0, end: 3 }),
				frameRate: 10,
				repeat: -1
			});
    	}

		// Animacion base
		this._player.play('idle');
	}

	#config_iluminacion(){

		// Crear la luz que seguirá al jugador
		this.light = this.scene.lights.addLight(this.x, this.y, 650, 0xffffff, 1.5);
		this._player.setPipeline('Light2D');
		this.weapon.setPipeline('Light2D');
	}
  
}
