import Phaser from 'phaser';
import BaseActor from './BaseActor';
import WeaponFactory from '../../factories/WeaponFactory';
import ClassIA from '../../factories/ClassIA';


export default class BaseEnemy extends BaseActor {
     
    // Atributos
    _enemyParameters = {

        state: undefined,

        weapon: undefined,
        visionRange: undefined,
        fireRate: undefined,
        shootingRange: undefined,
        minDistance: undefined,

        direction: undefined,
        x: undefined,
        y: undefined,

        dodgeIntensity: undefined,
        lastDodgeSwitch: undefined,
        dodgeSwitchInterval: undefined,
        dodgeDirection: undefined
    };

    

    
    constructor(scene, x, y, sprite, vida, speed) {
        super(scene, x, y, sprite, vida, speed);

        this.lastShotTime = 0;
    
        // Configurar física
        this.body.setSize(66, 78);
        this.body.setCollideWorldBounds(true);
        

        this._enemyParameters.x = this.x;
        this._enemyParameters.y = this.y;

        // Propiedades de la IA
        this._enemyParameters.state = 'patrullar';          
        this._enemyParameters.shootingRange = 540;             
        this._enemyParameters.minDistance = 150;        
        this._enemyParameters.direction = new Phaser.Math.Vector2(1, 0); 

        // Propiedades para el dodge(IA)
        this._enemyParameters.dodgeIntensity = 50;        
        this._enemyParameters.lastDodgeSwitch = 0;       
        this._enemyParameters.dodgeSwitchInterval = 1500; 
        this._enemyParameters.dodgeDirection = 1; 
    }

    add_weapon(weaponName, offset){
        this._enemyParameters.weapon = WeaponFactory.createWeapon(weaponName, this.scene, offset)
        this.add(this._enemyParameters.weapon)
    }

    preUpdate(time, delta) {
        
        const playerX = this.scene._player.x;
        const playerY = this.scene._player.y;
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);

        // Determinar estado según la distancia del jugador
        if (distanceToPlayer <= this._enemyParameters.shootingRange) {
            this.state = 'perseguir';
        }
        else if (this.state === 'perseguir') {
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
            if (distanceToPlayer > this._enemyParameters.shootingRange) {

                baseVX = Math.cos(chaseAngle) * this._atributos.speed;
                baseVY = Math.sin(chaseAngle) * this._atributos.speed;
            }
            else if (distanceToPlayer < this.minDistance) {

                const retreatAngle = Phaser.Math.Angle.Between(playerX, playerY, this.x, this.y);
                baseVX = Math.cos(retreatAngle) * this._atributos.speed;
                baseVY = Math.sin(retreatAngle) * this._atributos.speed;
            }

            // Movimiento evasivo (perpendicular al jugador)
            const perpendicularAngle = chaseAngle + this.dodgeDirection * (Math.PI / 2);
            const dodgeVX = Math.cos(perpendicularAngle) * this.dodgeIntensity;
            const dodgeVY = Math.sin(perpendicularAngle) * this.dodgeIntensity;

            // Aplicar velocidad
            this.body.setVelocity(baseVX + dodgeVX, baseVY + dodgeVY);

            // Disparar si está en rango
            if (distanceToPlayer <= this._enemyParameters.shootingRange && time > this.lastShotTime + this._enemyParameters.fireRate) {
                this._weapon.shot(playerX, playerY);
                this.lastShotTime = time;
            }
            this._weapon.setRotation(chaseAngle);

            const angleDeg = Phaser.Math.RadToDeg(chaseAngle);

            if (angleDeg >= -90 && angleDeg <= 90) {
                this._sprite.setFlipX(false);
                this._weapon.setFlipY(false); 
            } else {
                this._sprite.setFlipX(true);
                this._weapon.setFlipY(true); 
                this._sprite.setX(34);
            }

        }
        else if (this.state === 'patrullar') {
            if (this.body.blocked.left || this.body.blocked.right || this.body.blocked.up || this.body.blocked.down) {
                this.patrolDirection = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 1);
            }
            this.body.setVelocity(
                this.patrolDirection.x * this._atributos.speed,
                this.patrolDirection.y * this._atributos.speed
            );
            const patrolAngle = Phaser.Math.Angle.Between(0, 0, this.patrolDirection.x, this.patrolDirection.y);
            this._weapon.setRotation(patrolAngle);

            if (this.patrolDirection.x < 0) {
                this._sprite.setFlipX(true);
                this._weapon.setFlipY(true);
                this._sprite.setX(34);
            } else if (this.patrolDirection.x > 0) {
                this._sprite.setFlipX(false);
                this._weapon.setFlipY(false);
            }
        }
    }
}