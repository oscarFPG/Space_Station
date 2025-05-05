import BasedEnemy from '../base-game-objects/BaseEnemy.js'
import ClassIA from '../../factories/ClassIA.js';
import Builder from '../../managers/Builder.js';
import WeaponFactory from '../../factories/WeaponFactory.js';
import Coin from '../objects/Coin.js'

export default class Extended2Enemy extends BasedEnemy {

    static VIDA = 50
    static SPEED = 8
    static VALUE_COIN_DROPPED = 50

    constructor(scene, x, y){
        super(scene, x, y, {texture: Builder.ENEMY2_TEXTURE, x: 30, y: 30}, Extended2Enemy.VIDA, Extended2Enemy.SPEED)

        this.config_animacion('enemy_2idle', Builder.ENEMY2_TEXTURE, 0, 2, 6)
        this._sprite.play('enemy_2idle')

        // Propiedades de la IA
        this._enemyParameters.state = 'patrol';

        this._enemyParameters.minDistance = 150; 
        this._enemyParameters.visionRange = 2400          
        this._enemyParameters.shootingRange = 850;             
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

    add_weapon(){
        return WeaponFactory.crearArma(WeaponFactory.MACHINE_GUN_WEAPON_ENEMY, this.scene, {x: 40, y: 50})
    }

    dropObject() {
        return new Coin(this.scene, this.x + 25 , this.y + 25, Extended2Enemy.VALUE_COIN_DROPPED)
    }

}