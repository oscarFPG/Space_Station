import ExtendedEnemy from '../game-objects/characters/ExtendedEnemy';
import Extended2Enemy from '../game-objects/characters/Extended2Enemy';
import BaseTurret from '../game-objects/characters/BaseTurret';

export default class EnemyFactory {

    //  Identificadores para evitar 'numeros magicos'
    // Arma base
    static BASE_ENEMY_ID = 0;
    static BASE_TURRET_ID = 1;
    static BASE_2ENEMY_ID = 2;

    constructor(){
        throw new Error('La clase \'WeaponFactory\' no se puede y no se debe instanciar');
    }

    static createEnemy(enemmyName, scene, x, y){

        switch(enemmyName){
        case EnemyFactory.BASE_ENEMY_ID:
            return new ExtendedEnemy(scene, x, y) 
        case EnemyFactory.BASE_TURRET_ID:
            return new BaseTurret(scene, x, y);  
        case EnemyFactory.BASE_2ENEMY_ID:
            return new Extended2Enemy(scene, x, y) 
        default:
            throw new Error(`Objeto \'Weapon\' con identificador ${enemy} no encontrado`)
        }
    }
}