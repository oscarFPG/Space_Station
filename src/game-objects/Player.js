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

    // Inicializamos el sprite del jugador y sus vidas
    this.player = scene.add.sprite(28, 32, Player.IDLE_ANIMATION).setOrigin(0.5, 0.5);
    this.body.setSize(66, 78);
    this.lives = 3; // Inicia con 3 vidas

    // Configuración de controles, arma, animaciones e iluminación
    this.#config_controles();
    this.#config_arma();
    this.#config_animaciones();
    this.#config_iluminacion();
    
    // Añadimos al container
    this.add(this.player);
    this.add(this.weapon);

    // Registrar los métodos update y postupdate
    this.scene.events.on('update', this.update, this);
    this.scene.events.on('postupdate', this.updateWeapon, this);

    // Bandera para evitar impactos múltiples simultáneos
    this.isImpact = false;
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
	  this.player.setFlipX(true);
	  this.player.setX(34);
	}
	if (this.cursors.right.isDown || this.keys.right.isDown) {
	  velocityX = 1;
	  this.player.setFlipX(false);
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
	  offsetX = -15;
	}
	if (this.light) {
	  this.light.setPosition(this.x + offsetX, this.y);
	}
  }
  

  hitByBullet() {
    if (this.isImpact) return; 
    this.isImpact = true;
    
    // Decrementar una vida
    this.lives--;
    this.player.setTintFill(0xffffff);
    
    // Si aún tiene vidas, se quita el tinte en 80ms y se permite recibir nuevos impactos
    if(this.lives > 0) {
      this.scene.time.delayedCall(80, () => {
        this.player.clearTint();
        this.isImpact = false;
      });
    } else {
      // Si ya no tiene vidas, se crea un tween que desvanece el sprite durante 0.5 segundos y luego reinicia la escena
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

  #config_controles() {
    // Configuración de las teclas
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Disparo mediante ratón (si la consola no está activa)
    this.scene.input.on('pointerdown', (pointer) => {
      if (this.scene.consoleActive) return;
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

    // Iniciar con la animación idle
    this.player.play('idle');
  }

  #config_iluminacion() {
    // Agregar la luz que seguirá al jugador
    this.light = this.scene.lights.addLight(this.x, this.y, 650, 0xffffff, 1.5);
    this.player.setPipeline('Light2D');
    this.weapon.setPipeline('Light2D');
    this.player.setDepth(1);
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
	this.weapon.setFlipY(worldPoint.x < weaponWorldX);
  }
  
}
