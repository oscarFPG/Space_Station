import Phaser from 'phaser';
import PlayerUI from '../../UI/PlayerUI.js'
import BasePistol from '../weapons/BasePistol.js'
import BaseActor from '../base-game-objects/BaseActor.js'

export default class Player extends BaseActor {
  
	// Player animation names
	static IDLE_ANIMATION = 'playerIdle';
	static RUNNING_ANIMATION = 'playerRunning';

	static VIDA_INICIAL = 50;
	static ESCUDO_INICIAL = 50;
	static DINERO_INICIAL = 50;
	static BATERIA_INICIAL = 0;
	static SPEED = 180;

	constructor(scene, x, y) {

		super(scene, x, y, {texture: Player.IDLE_ANIMATION, x: 30, y: 30}, Player.VIDA_INICIAL, Player.SPEED);

		this.body.setSize(66, 73);	

		// Atributos del jugador
		this._escudo = Player.ESCUDO_INICIAL;
		this._dinero = Player.DINERO_INICIAL;
		this._baterias = Player.BATERIA_INICIAL;

		// Booleano para saber si esta en un menu o consola para no permitir el disparo
		this.isOnConsole = false;

		// Configuracion de controles, animaciones, iluminacion y del arma
		this._weapon = this.#config_arma()
		this.config_animacion('player_idle', Player.IDLE_ANIMATION, 0, 2, 6)
		this.config_animacion('player_running', Player.RUNNING_ANIMATION, 0, 3, 10)
		this._sprite.play('player_idle')
		
		// Configuraciones
		this.#config_controles()
		this.#config_iluminacion()

		// Registrar los métodos update y postupdate
		this.scene.events.on('update', this.update, this);
		this.scene.events.on('postupdate', this.updateWeapon, this);

		// Interfaz del personaje
		this._playerUI = new PlayerUI(this.scene, Player.VIDA_INICIAL, Player.ESCUDO_INICIAL, Player.DINERO_INICIAL);

		// Añadir al container
		this.add(this._weapon);
	}


	update(time, delta) {

		// Verificar que el body existe antes de acceder a él
		if (!this.body)
			return;

		// Actualiza la posición del container usando la posición del body
		this.setPosition(this.body.x, this.body.y);
		this.body.setVelocity(0);

		const speed = Player.SPEED;
		let velocityX = 0;
		let velocityY = 0;

		if (this.cursors.up.isDown || this.controles.up.isDown) {
			velocityY = -1;
		}
		if (this.cursors.down.isDown || this.controles.down.isDown) {
			velocityY = 1;
		}
		if (this.cursors.left.isDown || this.controles.left.isDown) {
			velocityX = -1;
			
		}
		if (this.cursors.right.isDown || this.controles.right.isDown) {
			velocityX = 1;
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
			if (this._sprite.anims.currentAnim.key !== 'player_running') {
				this._sprite.play('player_running');
			}
		} else {
			if (this._sprite.anims.currentAnim.key !== 'player_idle') {
				this._sprite.play('player_idle');
			}
		}

		let offsetX = 75; // Valor por defecto para cuando no está volteado
		if (this._sprite.flipX) {
			offsetX = -15;
		}
		if (this.light) {
			this.light.setPosition(this.x + offsetX, this.y);
		}

		this._playerUI.actualizar_UI(
			this._atributos.vida, 
			this._escudo, 
			this._dinero, 
			this._weapon.getBulletsFromClip(), 
			this._weapon.getMunicionReserva())
	}

	quitarVida(cantidad){

        if(this._escudo > 0)
			this._escudo -= cantidad
		else
			this._atributos.vida -= cantidad

        this.actualizar_color_efecto(this._atributos.vida / Player.VIDA_INICIAL)
		if (this._atributos.vida <= 0) {
			this.scene.tweens.add({
				targets: this.player,
				alpha: 0,
				duration: 500,
				onComplete: () => {
				  this.scene.scene.restart();
				}
			  });	
		}
    }

	healthBoost(health) {

		if (this._vida == this.VIDA_INICIAL) {
			return;
		}
		if (this._vida + health >= this.VIDA_INICIAL) {
			this._vida = this.VIDA_INICIAL;
		}
		else {
			this._vida += health;
		}
	}

	shieldBoost(shield) {
		//if (this._escudo == this.VIDA_INICIAL) {
		//	return;
		//}
		if (this._escudo + shield >= this.ESCUDO_INICIAL) {
			this._escudo = this.ESCUDO_INICIAL;
		}
		else {
			this._escudo += shield;
		}
	}

	moneyBoost(value) {
		this._dinero += value;
	}

	pickBattery() {
		this._baterias++;
	}

	vaciarBaterias() {
		this._baterias = Player.BATERIA_INICIAL;
	}
	getBatteries() {
		return this._baterias;
	}
	setIsConsoleActive(value) {
		this.isOnConsole = value;
	}

	updateWeapon() {

		// Si this.scene o this.scene.input no existen, no hacer nada.
		if (!this.scene || !this.scene.input) 
			return;

		const pointer = this.scene.input.activePointer;
		if (!pointer) 
			return; // Seguridad extra, en caso de que no exista el puntero.

		const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);

		const weaponWorldX = this.x + this._weapon.x;
		const weaponWorldY = this.y + this._weapon.y;

		let angle = Phaser.Math.Angle.Between(weaponWorldX, weaponWorldY, worldPoint.x, worldPoint.y);
		this._weapon.setRotation(angle);

		// Arma y modelo siempre mirando al mismo lado
		let shouldFlip = worldPoint.x < weaponWorldX
		this._weapon.setFlipY(shouldFlip)
		if(shouldFlip) {
			this._sprite.setX(34);
		}
		this._sprite.setFlipX(shouldFlip)
	}

	#config_controles(){

		// Controles de teclado
		this.cursors = this.scene.input.keyboard.createCursorKeys()
		this.controles = {
			up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
			down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
			right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
			left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
			reload: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
		}

		this.controles.reload.on('down', () => {
			this._weapon.reload()
		})

		// Disparo mediante ratón (si la consola no está activa)
		this.scene.input.on('pointerdown', (pointer) => {
			if (this.isOnConsole) 
				return;
			/*const gunSound = this.scene.sound.add('gun_sound');
			gunSound.setVolume(2);  // Ajusta el volumen del sonido
			gunSound.play();*/
			this._weapon.shot(pointer.worldX, pointer.worldY);
		}, this)
	}

	#config_arma() {

		var weaponOffset = { x: 39, y: 54 }
		var weapon = new BasePistol(this.scene, weaponOffset.x, weaponOffset.y)
		weapon.setOrigin(0.5, 0.5)

		return weapon
	}

	#config_iluminacion(){

		// Crear la luz que seguirá al jugador
		this.light = this.scene.lights.addLight(this.x, this.y, 650, 0xffffff, 1.5);
		this._sprite.setPipeline('Light2D');
		//this._weapon.setPipeline('')
	}
  
}
