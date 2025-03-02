import Phaser from 'phaser';
import BasePistol from '../game-objects/weapons/BasePistol';

export default class Enemy extends Phaser.GameObjects.Container {
    static IDLE_ANIMATION = 'enemyIdle';
    
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Crear el sprite del enemigo
        this.enemySprite = scene.add.sprite(28, 32, Enemy.IDLE_ANIMATION).setOrigin(0.5, 0.5);
        this.add(this.enemySprite);

        // Configurar física
        this.body.setSize(66, 78);
        this.body.setCollideWorldBounds(true);

        // Configurar el arma del enemigo
        this.weaponOffset = { x: 39, y: 54};
        this.weapon = new BasePistol(this.scene, this.weaponOffset.x, this.weaponOffset.y);
        this.weapon.setOrigin(0.5, 0.5); 
        this.add(this.weapon);

        //vida
        this.lives = 6;

        // Propiedades de movimiento y disparo
        this.speed = 175;
        this.fireRate = 1000; 
        this.lastShotTime = 0;

        // Propiedades de la IA
        this.state = 'patrol';          
        this.detectionRange = 540;      
        this.shootingRange = 468;       
        this.minDistance = 150;        
        this.patrolDirection = new Phaser.Math.Vector2(1, 0); 

        // Propiedades para el dodge
        this.dodgeIntensity = 50;        
        this.lastDodgeSwitch = 0;       
        this.dodgeSwitchInterval = 1500; 
        this.dodgeDirection = 1;        
    }
    hitByBullet() {
        if (this.isImpact) return; 
    
        this.lives--;
        this.enemySprite.setTintFill(0xffffff);
    
        if (this.lives > 0) {
            // Si aún tiene vidas, quitar el tint y permitir futuros impactos
            this.scene.time.delayedCall(80, () => {
                this.enemySprite.clearTint();
            });
        } else {
            // Marcar como muerto para evitar recibir más impactos
            this.isImpact = true;
    
            // Crear animación de desvanecimiento
            this.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    this.destroy(); // Elimina completamente al enemigo
                }
            });
        }
    }
    

    preUpdate(time, delta) {
        if (!this.scene.player) return; 
        
        const playerX = this.scene.player.x;
        const playerY = this.scene.player.y;
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);

        // Determinar estado según la distancia del jugador
        if (distanceToPlayer <= this.detectionRange) {
            this.state = 'perseguir';
        } else if (this.state === 'perseguir') {
            this.state = 'patrullar';
            this.patrolDirection = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 1);
        }

        if (this.state === 'perseguir') {
            const chaseAngle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY);

            if (time > this.lastDodgeSwitch + this.dodgeSwitchInterval) {
                this.dodgeDirection = Math.random() < 0.5 ? 1 : -1;
                this.lastDodgeSwitch = time;
            }

            // Determinar velocidad base según la distancia:
            let baseVX = 0, baseVY = 0;
            if (distanceToPlayer > this.shootingRange) {
                baseVX = Math.cos(chaseAngle) * this.speed;
                baseVY = Math.sin(chaseAngle) * this.speed;
            } else if (distanceToPlayer < this.minDistance) {
                const retreatAngle = Phaser.Math.Angle.Between(playerX, playerY, this.x, this.y);
                baseVX = Math.cos(retreatAngle) * this.speed;
                baseVY = Math.sin(retreatAngle) * this.speed;
            }

            // Movimiento evasivo (perpendicular al jugador)
            const perpendicularAngle = chaseAngle + this.dodgeDirection * (Math.PI / 2);
            const dodgeVX = Math.cos(perpendicularAngle) * this.dodgeIntensity;
            const dodgeVY = Math.sin(perpendicularAngle) * this.dodgeIntensity;

            // Aplicar velocidad
            this.body.setVelocity(baseVX + dodgeVX, baseVY + dodgeVY);

            // Disparar si está en rango
            if (distanceToPlayer <= this.shootingRange && time > this.lastShotTime + this.fireRate) {
                this.weapon.shot(playerX, playerY);
                this.lastShotTime = time;
            }
            this.weapon.setRotation(chaseAngle);

            const angleDeg = Phaser.Math.RadToDeg(chaseAngle);

            if (angleDeg >= -90 && angleDeg <= 90) {
                this.enemySprite.setFlipX(false);
                this.weapon.setFlipY(false); 
            } else {
                this.enemySprite.setFlipX(true);
                this.weapon.setFlipY(true); 
                this.enemySprite.setX(34);
            }

        } else if (this.state === 'patrullar') {
            if (this.body.blocked.left || this.body.blocked.right || this.body.blocked.up || this.body.blocked.down) {
                this.patrolDirection = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 1);
            }
            this.body.setVelocity(
                this.patrolDirection.x * this.speed,
                this.patrolDirection.y * this.speed
            );
            const patrolAngle = Phaser.Math.Angle.Between(0, 0, this.patrolDirection.x, this.patrolDirection.y);
            this.weapon.setRotation(patrolAngle);

            if (this.patrolDirection.x < 0) {
                this.enemySprite.setFlipX(true);
                this.weapon.setFlipY(true);
                this.enemySprite.setX(34);
            } else if (this.patrolDirection.x > 0) {
                this.enemySprite.setFlipX(false);
                this.weapon.setFlipY(false);
            }
        }
    }
}
