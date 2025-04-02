import Phaser from 'phaser';
import BaseActor from './BaseActor';
import WeaponFactory from '../../factories/WeaponFactory';
//import ClassIA from '../../factories/ClassIA'


export default class BaseEnemy extends BaseActor {
     
    // Atributos
    _enemyParameters = {

        state: undefined,

        weapon: undefined,
        minDistance: undefined,
        visionRange: undefined,
        shootingRange: undefined,
        direction: {x: undefined, y: undefined},

        dodgeIntensity: undefined,
        lastDodgeSwitch: undefined,
        dodgeSwitchInterval: undefined,
        dodgeDirection: undefined
    };

    
    constructor(scene, x, y, sprite, vida, speed) {
        super(scene, x, y, sprite, vida, speed);

        
    
        // Configurar física
        this.body.setSize(66, 78);
        this.body.setCollideWorldBounds(true);
    }

    add_weapon(weaponName, offset){
        this._enemyParameters.weapon = WeaponFactory.createWeapon(weaponName, this.scene, offset)
        this.add(this._enemyParameters.weapon)
    }
    
    preUpdate(time, delta) {
        
        const playerX = this.scene._player.x;
        const playerY = this.scene._player.y;
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);
        this.setPosition(this.body.x, this.body.y);
        // Determinar estado según la distancia del jugador
        if (distanceToPlayer <= this._enemyParameters.shootingRange) {
            this._enemyParameters.state = 'perseguir';
        }
        else if (this._enemyParameters.state === 'perseguir') {
            this._enemyParameters.state = 'patrullar';
            this._enemyParameters.direction = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 1);
        }

        if (this._enemyParameters.state === 'perseguir') {

            const chaseAngle = Phaser.Math.Angle.Between(this.x, this.y, playerX, playerY);

            if (time > this._enemyParameters.lastDodgeSwitch + this._enemyParameters.dodgeSwitchInterval) {
                this._enemyParameters.dodgeDirection = Math.random() < 0.5 ? 1 : -1;
                this._enemyParameters.lastDodgeSwitch = time;
            }

            // Determinar velocidad base según la distancia:
            let baseVX = 0, baseVY = 0;
            if (distanceToPlayer > this._enemyParameters.shootingRange) {

                baseVX = Math.cos(chaseAngle) * this._atributos.speed;
                baseVY = Math.sin(chaseAngle) * this._atributos.speed;
            }
            else if (distanceToPlayer < this._enemyParameters.minDistance) {

                const retreatAngle = Phaser.Math.Angle.Between(playerX, playerY, this.x, this.y);
                baseVX = Math.cos(retreatAngle) * this._atributos.speed;
                baseVY = Math.sin(retreatAngle) * this._atributos.speed;
            }

            // Movimiento evasivo (perpendicular al jugador)
            const perpendicularAngle = chaseAngle + this._enemyParameters.dodgeDirection * (Math.PI / 2);
            const dodgeVX = Math.cos(perpendicularAngle) * this._enemyParameters.dodgeIntensity;
            const dodgeVY = Math.sin(perpendicularAngle) * this._enemyParameters.dodgeIntensity;

            // Aplicar velocidad
            this.body.setVelocity(baseVX + dodgeVX, baseVY + dodgeVY);

            // Disparar si está en rango
            if (distanceToPlayer <= this._enemyParameters.shootingRange) {
                this._enemyParameters.weapon.shot(playerX, playerY);
                
            }
            this._enemyParameters.weapon.setRotation(chaseAngle);

            const angleDeg = Phaser.Math.RadToDeg(chaseAngle);

            if (angleDeg >= -90 && angleDeg <= 90) {
                this._sprite.setFlipX(false);
                this._enemyParameters.weapon.setFlipY(false); 
            } else {
                this._sprite.setFlipX(true);
                this._enemyParameters.weapon.setFlipY(true); 
                this._sprite.setX(34);
            }

        }
        else if (this._enemyParameters.state === 'patrullar') {
            if (this.body.blocked.left || this.body.blocked.right || this.body.blocked.up || this.body.blocked.down) {
                this._enemyParameters.direction = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 1);
            }
            this.body.setVelocity(
                this._enemyParameters.direction.x * this._atributos.speed,
                this._enemyParameters.direction.y * this._atributos.speed
            );
            const patrolAngle = Phaser.Math.Angle.Between(0, 0, this._enemyParameters.direction.x, this._enemyParameters.direction.y);
            this._enemyParameters.weapon.setRotation(patrolAngle);

            if (this._enemyParameters.direction.x < 0) {
                this._sprite.setFlipX(true);
                this._enemyParameters.weapon.setFlipY(true);
                this._sprite.setX(34);
            } else if (this._enemyParameters.direction.x > 0) {
                this._sprite.setFlipX(false);
                this._enemyParameters.weapon.setFlipY(false);
            }
        }
    }
    /**/
}