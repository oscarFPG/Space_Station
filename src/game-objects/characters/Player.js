import Phaser from 'phaser'
import PlayerUI from '../../UI/PlayerUI.js'
import BaseActor from '../base-game-objects/BaseActor.js'
import WeaponFactory from '../../factories/WeaponFactory.js';
import WeaponObject from '../objects/WeaponObject.js'
import Builder from '../../managers/Builder.js';
import Options from '../../managers/Options.js';

export default class Player extends BaseActor {

	static VIDA_INICIAL = 20
	static ESCUDO_INICIAL = 15
	static DINERO_INICIAL = 0
	static BATERIA_INICIAL = 0
	static SPEED = 200

	static WEAPON_OFFSET = { x: 39, y: 54 }

	constructor(scene, x, y, health, shield, money, firstWeapon, secondaryWeapon) {
		super(scene, x, y, {texture: Builder.IDLE_ANIMATION, x: 30, y: 30}, health, Player.SPEED)
		
		this.body.setSize(66, 73)
		this.body.setCollideWorldBounds(true)
        this.body.setImmovable(true)

		// Atributos del jugador
		this._escudo = shield
		this._dinero = money
		this._baterias = Player.BATERIA_INICIAL

		// Configuracion del arma
		this._weapon = (firstWeapon == null) ? this.#config_arma(WeaponFactory.BASE_WEAPON): firstWeapon
		this._secondaryWeapon = secondaryWeapon
		this._armaEquipada = this._weapon 
		
		// Configuracion de controles
		this.#config_controles()

		// Configuracion de iluminacion
		this.#config_iluminacion()

		// Configuracion de animaciones
		this.config_animacion('player_idle', Builder.IDLE_ANIMATION, 0, 2, 6)
		this.config_animacion('player_running', Builder.RUNNING_ANIMATION, 0, 3, 10)
		this._sprite.play('player_idle')

		// Registrar los métodos update y postupdate
		this.scene.events.on('update', this.update, this)
		this.scene.events.on('postupdate', this.updateWeapon, this)

		// Interfaz del personaje
		this._playerUI = new PlayerUI(this.scene, Player.VIDA_INICIAL, Player.ESCUDO_INICIAL, Player.DINERO_INICIAL, Player.BATERIA_INICIAL)
		this.scene.uiLayer.add(this._playerUI);
		// Añadir al container
		this.add(this._weapon)
		if (this._secondaryWeapon) {
			this._secondaryWeapon.setVisible(false);
			this.add(this._secondaryWeapon);
		  }

		//Se crean texto para informar al jugador de recargar o cambiar arma
		// Texto “Recargar [R]”

		this.reloadText = scene.add.text(30, -50, 'Reload [R]', {
			fontSize: '18px',
			color: '#ffffff',
			backgroundColor: '#000000aa',
			padding: { x: 8, y: 4 }
		  })
		  .setOrigin(0.5)
		  .setDepth(20)
		  .setScrollFactor(1)
		  .setVisible(false);
		  this.add(this.reloadText);

		this.changeWeaponText = scene.add.text(30, -50, 'Change weapon [Q]', {
			fontSize: '18px',
			color: '#ffffff',
			backgroundColor: '#000000aa',
			padding: { x: 8, y: 4 }
		  })
		  .setOrigin(0.5)
		  .setDepth(20)
		  .setScrollFactor(1)
		  .setVisible(false);
		  this.add(this.changeWeaponText);
	  
		  // Spinner de recarga
		  this.reloadSpinner = scene.add.graphics({ x: 30, y: -40 });
		  this.reloadSpinner.lineStyle(4, 0x00AADD, 1);
		  this.reloadSpinner.strokeCircle(0, 0, 16);
		  this.reloadSpinner.strokeCircle(0, 0, 12);
		  this.reloadSpinner
			.setDepth(20)
			.setScrollFactor(1)
			.setVisible(false);
		  this.add(this.reloadSpinner);
  
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
			this._baterias,
			this._armaEquipada.getBulletsFromClip(),
			this._armaEquipada.getBulletsFromReserve(),
			this._armaEquipada.getClipSize()
		) 
		// Indicador de recarga o texto
		const reloading = this._armaEquipada.getIsReloading()
		const secondayWeaponAvailable = (this._secondaryWeapon) ? true: false;
		const empty = this._armaEquipada.getBulletsFromClip() === 0;
		const emptyReserve = this._armaEquipada.getBulletsFromReserve() === 0;
		this.DibujaInformacion(reloading, empty, emptyReserve, secondayWeaponAvailable)
	}

	updateWeapon() {

		// Si this.scene o this.scene.input no existen, no hacer nada.
		if (!this.scene || !this.scene.input) 
			return;

		const pointer = this.scene.input.activePointer;
		if (!pointer) 
			return; // Seguridad extra, en caso de que no exista el puntero.


		const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)
		const weaponWorldX = this.x + this._armaEquipada.x
		const weaponWorldY = this.y + this._armaEquipada.y

		let angle = Phaser.Math.Angle.Between(weaponWorldX, weaponWorldY, worldPoint.x, worldPoint.y)
		this._armaEquipada.setRotation(angle)

		// Arma y modelo siempre mirando al mismo lado
		let shouldFlip = worldPoint.x < weaponWorldX
		this._armaEquipada.setFlipY(shouldFlip)
		if(shouldFlip) {
			this._sprite.setX(34)
		}
		this._sprite.setFlipX(shouldFlip)
		// Si el arma tiene laser vision activado
		if (this._armaEquipada.getLaserVision()) {
			// Dibujar el laser (como línea roja)
			if (!this._laserGraphics) {
			  this._laserGraphics = this.scene.add.graphics();
			  this._laserGraphics.setDepth(10); // Aseguramos que el laser se dibuje sobre otros objetos
			}
			this._laserGraphics.clear();
			this._laserGraphics.lineStyle(1, 0xff0000, 1);
		
			// Definir un largo para el laser (puedes ajustar este valor)
			const laserLength = 1700;
			const laserEndX = weaponWorldX + Math.cos(angle) * laserLength;
			const laserEndY = weaponWorldY + Math.sin(angle) * laserLength;
			this._laserGraphics.strokeLineShape(new Phaser.Geom.Line(weaponWorldX, weaponWorldY, laserEndX, laserEndY));	  
		  } else {
			// Si el arma no tiene laser vision, se limpia (o se oculta) la gráfica del laser si existe
			if (this._laserGraphics) {
			  this._laserGraphics.clear();
			}
		  }
	}

	quitarVida(cantidad){

        if (this._escudo >= cantidad) {
			this._escudo -= cantidad;
		} else {
			const leftover = cantidad - this._escudo;
			this._escudo = 0;
			this._atributos.vida -= leftover;
		}
		

		// Animacion de daño respecto a la vida restante
        this.actualizar_color_efecto(this._atributos.vida / Player.VIDA_INICIAL)

		// Personaje muerto
		if (this._atributos.vida <= 0) {
			this.scene.tweens.add({
				targets: this.player,
				alpha: 0,
				duration: 500,
				onComplete: () => {
				  this.scene.gameOver()	// TODO - Modificar a: llevar al lobby
				}
			  });	
		}
    }

	healthBoost(health) {
		this._atributos.vida = Phaser.Math.Clamp(this._atributos.vida + health, 0, Player.VIDA_INICIAL)
	}

	shieldBoost(shield) {
		this._escudo = Phaser.Math.Clamp(this._escudo + shield, 0, Player.ESCUDO_INICIAL)
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

	set_player_activo(status) {
		this._atributos.activo = status
	}

	quitar_baterias(amount){
		this._baterias -= amount
		this._baterias = (this._baterias < 0) ? 0 : this._baterias
	}

	getCountAmmoType(weaponAmmo){
		
		switch(weaponAmmo){
			case 'pistol':
				return 0
		
			case 'machine gun':
				return 0

			case 'fusil':
				return 0

			case 'escopeta':
				return 0

			case 'sniper':
				return 0
				
			default:
				return -1
			}
    }

	recogerArma(texturaArma, currentAmmo, reserveAmmo){
		this._secondaryWeapon = WeaponFactory.crearArma(texturaArma, this.scene, Player.WEAPON_OFFSET)
		if(currentAmmo != null && reserveAmmo != null) {
			this._secondaryWeapon.setCurrentAmmo(currentAmmo)
			this._secondaryWeapon.setReserveAmmo(reserveAmmo)
		}
		this._armaEquipada = this._secondaryWeapon
		this._weapon.setVisible(false)
		
		this.add(this._secondaryWeapon)
	}

	intercambiarArma(x, y, texturaArma, currentAmmo, reserveAmmo) {
		const spriteArmaDejada = this._armaEquipada.getWeaponSprite();
		const municionArmaDejada = this._armaEquipada.getBulletsFromClip();
		const reservaArmaDejada = this._armaEquipada.getBulletsFromReserve();
	
		const armaDejada = new WeaponObject(
		  this.scene,
		  x, 
		  y, 
		  spriteArmaDejada,
		  municionArmaDejada, 
		  reservaArmaDejada
		);
		this.scene.add.existing(armaDejada);

		const nuevaArma = WeaponFactory.crearArma(texturaArma, this.scene, Player.WEAPON_OFFSET);
		if(currentAmmo != null && reserveAmmo != null) {
			nuevaArma.setCurrentAmmo(currentAmmo)
			nuevaArma.setReserveAmmo(reserveAmmo)
		}
		if (this._armaEquipada === this._weapon) {
			this.remove(this._weapon, true); 
			this._weapon = nuevaArma;
		} else {
			this.remove(this._secondaryWeapon, true);
			this._secondaryWeapon = nuevaArma;
		}
		this._armaEquipada = nuevaArma;
		this.add(this._armaEquipada);
	}
	

	// Objeto para preservar el estado actual del jugador(vida, monedas, armas, etc...) entre niveles o partidas
	getPlayerStatus(_previousScene){

		const status = {
			health: this._atributos.vida,
			shield: this._escudo,
			money: this._dinero,
			weapon1: { key: this._weapon._specs.sprite, CurrentAmmo: this._weapon.getBulletsFromClip(), ReserveAmmo: this._weapon.getBulletsFromReserve(), offset: Player.WEAPON_OFFSET},
			weapon2: this._secondaryWeapon
					  ? { key: this._secondaryWeapon._specs.sprite, CurrentAmmo: this._secondaryWeapon.getBulletsFromClip(), ReserveAmmo: this._secondaryWeapon.getBulletsFromReserve(), offset: Player.WEAPON_OFFSET}
					  : null,
			previousScene : _previousScene
		  };

		return status
	}

	pickAmmo(ammoType, ammo) {
		
		if (this._weapon.getBulletsType() == ammoType) 
			return this._weapon.boostAmmo(ammo)
		else if (this._secondaryWeapon && this._secondaryWeapon.getBulletsType() == ammoType)
			return this._secondaryWeapon.boostAmmo(ammo)
		return this._weapon.getBulletsType() == ammoType || (this._secondaryWeapon && this._secondaryWeapon.getBulletsType() == ammoType)
	}

	getIsActiveSecondaryWeapon() {
		return this._secondaryWeapon
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
			switchWeapon: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
			pause: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
		}

		this.controles.reload.on('down', () => {	// Recargar
			if (!this._atributos.activo) return;
			this._armaEquipada.reload();
			this.reloadText.setVisible(true);
		})

		this.controles.switchWeapon.on('down', () => {	// Cambiar de arma

			if(this._secondaryWeapon == null)
				return
			const options = Options.get_instance();
			options.playSound(this.scene, 'pick_up_gun', { isMusic: false, volume: 1.0 });
			if(this._armaEquipada == this._weapon){
				this._weapon.setVisible(false)
				this._secondaryWeapon.setVisible(true)
				this._armaEquipada = this._secondaryWeapon
			}
			else{
				this._secondaryWeapon.setVisible(false)
				this._weapon.setVisible(true)
				this._armaEquipada = this._weapon
			}
		})

		// Disparo mediante el click izquierdo del ratón
		this.scene.input.on('pointerdown', (pointer) => {	// Disparar(click izquierdo)
			if(this._atributos.activo && !this._armaEquipada.getIsReloading()) {
				this._armaEquipada.shot(pointer.worldX, pointer.worldY)
			}
		}, this)
	}

	#config_arma(texturaArma) {

		var weapon = WeaponFactory.crearArma(texturaArma, this.scene, Player.WEAPON_OFFSET)
		weapon.setOrigin(0.5, 0.5)
		weapon.setPipeline('Light2D')

		return weapon
	}

	#config_iluminacion(){

		// Crear la luz que seguirá al jugador
		this.light = this.scene.lights.addLight(this.x, this.y, 650, 0xffffff, 1.5);
		this._sprite.setPipeline('Light2D');
		//this._weapon.setPipeline('')
	}

	DibujaInformacion(reloading, empty, emptyReserve, secondayWeaponAvailable) {
		if (reloading) {
			// Oculta el texto, ya que se mostrará el spinner animado
			this.reloadText.setVisible(false);
			this.changeWeaponText.setVisible(false);
			
			// Tween para el giro del spinner (rotación continua)
			if (!this.reloadSpinner._tween) {
				this.reloadSpinner._tween = this.scene.tweens.add({
				targets: this.reloadSpinner,
				angle: 360, // gira 360 grados
				duration: this._armaEquipada.getReloadTime() * 1000,
				repeat: -1,
				ease: 'Linear'
				});
			}
			// Tween para un efecto de pulso (escala) en el spinner
			if (!this.reloadSpinner._scaleTween) {
				this.reloadSpinner._scaleTween = this.scene.tweens.add({
				targets: this.reloadSpinner,
				scale: { from: 0.8, to: 1.2 },
				duration: 500,
				yoyo: true,
				repeat: -1,
				ease: 'Sine.easeInOut'
				});
			}
			// Tween adicional para animar levemente el arma (efecto de "bounce" o sacudida)
			if (!this._armaEquipada._reloadEffectTween) {
				this._armaEquipada._reloadEffectTween = this.scene.tweens.add({
				targets: this._armaEquipada,
				y: this._armaEquipada.y - 8, // mueve el arma 10 pixeles hacia arriba
				duration: (this._armaEquipada.getReloadTime() * 1000) / 2,
				yoyo: true,
				repeat: -1,
				ease: 'Quad.easeInOut'
				});
			}
			// Aseguramos que el spinner sea visible
			this.reloadSpinner.setVisible(true);

			} else if (empty) {
				// Si no hay munición y no se está recargando, mostramos el texto de recarga
				if (this.reloadSpinner._tween) {
					this.reloadSpinner._tween.stop();
					delete this.reloadSpinner._tween;
				}
				if (this.reloadSpinner._scaleTween) {
					this.reloadSpinner._scaleTween.stop();
					delete this.reloadSpinner._scaleTween;
				}
				if (this._armaEquipada._reloadEffectTween) {
					this._armaEquipada._reloadEffectTween.stop();
					delete this._armaEquipada._reloadEffectTween;
				}
				this.reloadSpinner.setVisible(false);
				this.reloadSpinner.angle = 0;
				if (emptyReserve && secondayWeaponAvailable)  {
					this.changeWeaponText.setVisible(true);
					this.reloadText.setVisible(false);
				}
				else { 
					this.changeWeaponText.setVisible(false);
					this.reloadText.setVisible(true);
				}
			} else {
			// Caso normal, cuando no se está recargando
			this.changeWeaponText.setVisible(false);
			this.reloadText.setVisible(false);
			if (this.reloadSpinner._tween) {
				this.reloadSpinner._tween.stop();
				delete this.reloadSpinner._tween;
			}
			if (this.reloadSpinner._scaleTween) {
				this.reloadSpinner._scaleTween.stop();
				delete this.reloadSpinner._scaleTween;
			}
			if (this._armaEquipada._reloadEffectTween) {
				this._armaEquipada._reloadEffectTween.stop();
				delete this._armaEquipada._reloadEffectTween;
			}
			this.reloadSpinner.setVisible(false);
			this.reloadSpinner.angle = 0;
		}

	}

	getFirstWeapon() {
		return this._weapon
	}
	getSecondWeapon() {
		return this._secondaryWeapon
	}
	getShield() {
		return this._escudo
	}
	getHealth() {
		return this._atributos.vida
	}
	getSpeed() {
		return this._atributos.speed
	}
	getMoney() { return this._dinero }
	getBatteries() { return this._baterias }
	getMoneyDefault() { return Player.DINERO_INICIAL}
	getShieldDefault() { return Player.ESCUDO_INICIAL }
	getHealthDefault() { return Player.VIDA_INICIAL }
	getSpeedDefault() { return Player.SPEED }
	isFullHealth() { return this._atributos.vida === Player.VIDA_INICIAL }
	isFullShield() { return this._escudo === Player.ESCUDO_INICIAL }
	isUseKeyJustPressed(){ return Phaser.Input.Keyboard.JustDown(this.controles.use) }
	isPauseKeyJustPressed(){ return Phaser.Input.Keyboard.JustDown(this.controles.pause) }
}
