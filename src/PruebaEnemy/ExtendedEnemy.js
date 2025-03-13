import BasedEnemy from './BasedEnemy'


export default class ExtendedEnemy extends BasedEnemy{

    static BASE_ENEMY_WEAPON = 'weapon1';
    static BASE_ENEMY_TEXTURE = 'enemyIdle'; 

    constructor(scene, x, y){
        super(scene, x, y, ExtendedEnemy.BASE_ENEMY_TEXTURE, ExtendedEnemy.BASE_ENEMY_WEAPON);

        //this._especificacion.weaponName = 'weapon1'
        //this._especificacion.texture = 'enemyIdle'

        this._atributos.speed = 175
        this._atributos.visionRange = 540
        this._atributos.fireRate = 1000;
        this._atributos.shootingRange = 468;
        this._atributos.health = 50
       
       //

    }

    
}