import BasedEnemy from '../base-game-objects/BaseEnemy.js'
import ClassIA from '../../factories/ClassIA.js';
import Builder from '../../managers/Builder.js';
import WeaponFactory from '../../factories/WeaponFactory.js';
import Battery from '../objects/Battery.js'

export default class FinalBoss extends BasedEnemy {

    static VIDA = 400
    static SPEED = 5
    static VALUE_COIN_DROPPED = 25

    constructor(scene, x, y){
        super(scene, x, y, {texture: Builder.FINAL_BOSS_TEXTURE, x: 40, y: 40}, FinalBoss.VIDA, FinalBoss.SPEED)
        this.body.setSize(92.4, 109.2);
        this.config_animacion('boss_idle', Builder.FINAL_BOSS_TEXTURE, 0, 2, 6)
        this._sprite.play('boss_idle')

        // Propiedades de la IA
        this._enemyParameters.state = 'patrol';

        this._enemyParameters.minDistance = 150; 
        this._enemyParameters.visionRange = 4000          
        this._enemyParameters.shootingRange = 2800;             
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
        return WeaponFactory.crearArma(WeaponFactory.FINAL_WEAPON, this.scene, {x: 40, y: 50})
    }
    dropObject() {
        this.scene.putFinalTheme()
        return new Battery(this.scene, this.x + 25 , this.y + 25)
    }
}