import Phaser from 'phaser';
import Weapon from './Weapon';

export default class Player extends Phaser.Physics.Arcade.Sprite {
	
	// Player animation names
	static IDLE_ANIMATION = 'playerIdle';
	static RUNNING_ANIMATION = 'playerRunning';

	constructor(scene, x, y) {

		super(scene, x, y);
		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);
		this.setCollideWorldBounds(true);

		// Player attributes
		this._health = 100;						// PS(Puntos de Salud) del jugador
		this._movementSpeed = 650;				// Velocidad de movimiento
		this._isMoving = false;					// Comprueba si el jugador esta en movimiento o no
		this._weaponOffset = { x: 15, y: 32 };	// Offset del arma respecto al jugador

		// Set up player controller, animations and weapon
		this.#set_up_player_controller();
		this.#set_up_player_animations();
		this.#set_up_player_weapon();

		// Usar el evento 'postupdate' para actualizar el arma después de los cambios de física y render
		this.scene.events.on('postupdate', this.updateWeapon, this);
	}

	preUpdate(time, delta) {

		super.preUpdate(time, delta);

		this._isMoving = this.cursors.up.isDown || this.keys.up.isDown ||
						this.cursors.down.isDown || this.keys.down.isDown ||
						this.cursors.left.isDown || this.keys.left.isDown ||
						this.cursors.right.isDown || this.keys.right.isDown;
		this.#move();
		this.#change_animation();
	}

	updateWeapon() {

		// Calcular la posición del arma respecto al jugador usando el offset
		const offsetX = this.flipX ? -this._weaponOffset.x : this._weaponOffset.x;
		const offsetY = this._weaponOffset.y;
		this.weapon.setPosition(this.x + offsetX, this.y + offsetY);

		// Calcular la rotación usando la posición del ratón en pantalla
		const pointer = this.scene.input.activePointer;
		const centerX = this.scene.cameras.main.width / 2;
		const centerY = this.scene.cameras.main.height / 2;
		const angle = Phaser.Math.Angle.Between(centerX, centerY, pointer.x, pointer.y);
		this.weapon.setRotation(angle);

		// Voltear el arma verticalmente según la posición del ratón
		this.weapon.setFlipY(pointer.x < centerX);
	}

	// Set up
	#set_up_player_controller(){

		this.cursors = this.scene.input.keyboard.createCursorKeys();
		this.keys = this.scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D
		});
	}

	#set_up_player_animations(){

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

		this.play('idle');
	}

	#set_up_player_weapon(){

		// Crear el arma (tipo Image, no Sprite con física)
		this.weapon = new Weapon(this.scene, this.x, this.y, 20, 10, 2, Weapon.BASE_WEAPON);
	}

	// Player actions
	#move(){

		let Velocity2D = new Phaser.Math.Vector2(0, 0);

		// Movimiento vertical => if-elseif para evitar personaje quieto al presionar ambas
		if (this.cursors.up.isDown || this.keys.up.isDown)
			Velocity2D.y = -1;
		else if (this.cursors.down.isDown || this.keys.down.isDown)
			Velocity2D.y = 1;

		// Movimiento horizontal => if-elseif para evitar personaje quieto al presionar ambas
		if (this.cursors.left.isDown || this.keys.left.isDown) {
			Velocity2D.x = -1;
			this.setFlipX(true);
		}
		else if (this.cursors.right.isDown || this.keys.right.isDown) {
			Velocity2D.x = 1;
			this.setFlipX(false);
		}

		Velocity2D.scale(this._movementSpeed);
		this.setVelocity(Velocity2D.x, Velocity2D.y);
	}

	#change_animation(){

		// Actualizar animación según movimiento
		if (this._isMoving) {
			if (this.anims.currentAnim.key !== 'running') {
			this.play('running');
			}
		} else {
			if (this.anims.currentAnim.key !== 'idle') {
			this.play('idle');
			}
		}
	}
}