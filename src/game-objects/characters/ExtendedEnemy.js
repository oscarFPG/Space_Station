import BasedEnemy from '../base-game-objects/BaseEnemy.js'
import ClassIA from '../../factories/ClassIA.js';

export default class ExtendedEnemy extends BasedEnemy {

    static BASE_ENEMY_WEAPON = 'weapon1';
    static BASE_ENEMY_TEXTURE = 'enemyIdle';

    static VIDA = 25
    static SPEED = 10

    constructor(scene, x, y){
        super(scene, x, y, {texture: ExtendedEnemy.BASE_ENEMY_TEXTURE, x: 30, y: 30}, ExtendedEnemy.VIDA, ExtendedEnemy.SPEED)

        this.add_weapon(ExtendedEnemy.BASE_ENEMY_WEAPON, {x: 40, y: 50})
        this.config_animacion('enemy_idle', ExtendedEnemy.BASE_ENEMY_TEXTURE, 0, 2, 6)
        this._sprite.play('enemy_idle')
        
        // Propiedades de la IA
        this._enemyParameters.state = 'patrol';

        this._enemyParameters.minDistance = 150; 
        this._enemyParameters.visionRange = 900          
        this._enemyParameters.shootingRange = 540;             
        this._enemyParameters.direction = new Phaser.Math.Vector2(1, 0); 

        // Propiedades para el dodge(IA)
        this._enemyParameters.dodgeIntensity = 50;        
        this._enemyParameters.lastDodgeSwitch = 0;       
        this._enemyParameters.dodgeSwitchInterval = 1500; 
        this._enemyParameters.dodgeDirection = 1; 
    }
    
    preUpdate(time, delta) {
        ClassIA.buscaJugador(time, this, this.scene._player);
    }
}