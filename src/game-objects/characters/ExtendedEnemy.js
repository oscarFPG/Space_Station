import ClassIA from '../../factories/ClassIA.js';
import BasedEnemy from '../base-game-objects/BaseEnemy.js'


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
        
        
        

        
    }
    /*
    preUpdate(time, delta) {
        ClassIA.buscaJugador(time, this, this.scene._player);
    }/**/
}