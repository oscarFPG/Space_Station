import BasedEnemy from './BasedEnemy'
export default class ExtendedEnemy extends  BasedEnemy{

    // static BASE_ENEMY_HP = 50;
    static BASE_ENEMY_TEXTURE = 'enemyIdle'; 
    static BASE_ENEMY_WEAPON = 'weapon1';

    constructor(scene, x, y){
        super(scene, x, y, ExtendedEnemy.BASE_ENEMY_TEXTURE, ExtendedEnemy.BASE_ENEMY_WEAPON);

        this._atributos.speed = 300
        this._atributos.vida = 50
        // this._atributos.visionRange = 


    }

    
}
