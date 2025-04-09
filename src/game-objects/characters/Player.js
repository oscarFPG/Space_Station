import Phaser from 'phaser'
import PlayerUI from '../../UI/PlayerUI.js'
import BasePistol from '../weapons/BasePistol.js'
import BaseActor from '../base-game-objects/BaseActor.js'

export default class Player extends BaseActor {
  
	// Player animation names
	static IDLE_ANIMATION = 'playerIdle';
	static RUNNING_ANIMATION = 'playerRunning';

	static VIDA_INICIAL = 20;
	static ESCUDO_INICIAL = 15;
	static DINERO_INICIAL = 0;
	static BATERIA_INICIAL = 0;
	static SPEED = 180;

	constructor(scene, x, y) {
		super(scene, x, y, {texture: Player.IDLE_ANIMATION, x: 30, y: 30}, Player.VIDA_INICIAL, Player.SPEED);
		
		this.body.setSize(66, 73);
		this.body.setCollideWorldBounds(true)
        this.body.setImmovable(true)

		// Atributos del jugador
		this._escudo = Player.ESCUDO_INICIAL;
		this._dinero = Player.DINERO_INICIAL;
		this._baterias = Player.BATERIA_INICIAL;

		// Configuracion del arma
		this._weapon = this.#config_arma()
		
		// Configuracion de controles
		this.#config_controles()

		// Configuracion de iluminacion
		this.#config_iluminacion()

		// Configuracion de animaciones
		this.config_animacion('player_idle', Player.IDLE_ANIMATION, 0, 2, 6)
		this.config_animacion('player_running', Player.RUNNING_ANIMATION, 0, 3, 10)
		this._sprite.play('player_idle')

		// Registrar los métodos update y postupdate
		this.scene.events.on('update', this.update, this);
		this.scene.events.on('postupdate', this.updateWeapon, this);

		// Interfaz del personaje
		this._playerUI = new PlayerUI(this.scene, Player.VIDA_INICIAL, Player.ESCUDO_INICIAL, Player.DINERO_INICIAL);

		// Añadir al container
		this.add(this._weapon);
	}


	update(time, delta) {

		if(!this.scene || !this._atributos.activo)
			return

		// Actualiza la posición del container usando la posición del body
		this.setPosition(this.body.x, this.body.y);
		this.body.setVelocity(0);

		const speed = Player.SPEED;
		let velocityX = 0;
		let velocityY = 0;

		// Detectar teclas pulsadas
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
			if (this._sprite.anims.currentAnim.key !== 'player_running')
				this._sprite.play('player_running');
		}
		else {
			if (this._sprite.anims.currentAnim.key !== 'player_idle')
				this._sprite.play('player_idle');
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

        if(this._escudo > 0) {
			if (this._escudo - cantidad <= 0)
				this._escudo = 0;
			else
				this._escudo -= cantidad
		}
		else
			this._atributos.vida -= cantidad

		// Animacion de daño respecto a la vida restante
        this.actualizar_color_efecto(this._atributos.vida / Player.VIDA_INICIAL)

		// Personaje muerto
		if (this._atributos.vida <= 0) {
			this.scene.tweens.add({
				targets: this.player,
				alpha: 0,
				duration: 500,
				onComplete: () => {
				  this.scene.scene.restart()	// TODO - Modificar a: llevar al lobby
				}
			  });	
		}
    }

	healthBoost(health) {
		this._atributos.vida = Phaser.Math.Clamp(this._atributos.vida + health, 0, Player.VIDA_INICIAL)
	}

	shieldBoost(shield) {
		if (this._escudo + shield >= Player.ESCUDO_INICIAL) {
			this._escudo = Player.ESCUDO_INICIAL;
		}
		else {
			this._escudo += shield;
		}
	}

	moneyBoost(value) {
		this._dinero += value;
	}

	receiveMoney(amount) {
		this._dinero += amount;
	}

	pickBattery() {
		this._baterias++;
	}

	vaciarBaterias() {
		this._baterias = Player.BATERIA_INICIAL;
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
			// Movimiento
			up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
			down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
			right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
			left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),

			// Acciones
			use: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
			reload: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
			pause: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
		}

		this.controles.reload.on('down', () => {
			if(this._atributos.activo)
				this._weapon.reload()
		})

		// Disparo mediante ratón (si la consola no está activa)
		this.scene.input.on('pointerdown', (pointer) => {
			
			if(this._atributos.activo)
				this._weapon.shot(pointer.worldX, pointer.worldY);
		}, this)
	}

	#config_arma() {

		var weaponOffset = { x: 39, y: 54 }
		var weapon = new BasePistol(this.scene, weaponOffset.x, weaponOffset.y)
		weapon.setOrigin(0.5, 0.5)
		weapon.setPipeline('Light2D');
		return weapon
	}

	#config_iluminacion(){

		// Crear la luz que seguirá al jugador
		this.light = this.scene.lights.addLight(this.x, this.y, 650, 0xffffff, 1.5);
		this._sprite.setPipeline('Light2D');
		//this._weapon.setPipeline('')
	}

	set_player_activo(status) {
		this._atributos.activo = status
	}

	quitar_baterias(amount){
		this._baterias -= amount
		this._baterias = (this._baterias < 0) ? 0 : this._baterias
	}
	
	getBatteries() { return this._baterias }
	isFullHealth() { return this._atributos.vida === Player.VIDA_INICIAL }
	isFullShield() { return this._escudo === Player.ESCUDO_INICIAL }
	isUseKeyJustPressed(){ return Phaser.Input.Keyboard.JustDown(this.controles.use) }
	isPauseKeyJustPressed(){ return Phaser.Input.Keyboard.JustDown(this.controles.pause) }
}
