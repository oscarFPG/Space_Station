import ExtendedEnemy from '../game-objects/characters/ExtendedEnemy';
import Extended2Enemy from '../game-objects/characters/Extended2Enemy';
import BaseTurret from '../game-objects/characters/BaseTurret';
import SlowTurret from '../game-objects/characters/SlowTurret';
import FinalBoss from '../game-objects/characters/FinalBoss';

export default class EnemyFactory {

    //  Identificadores para evitar 'numeros magicos'
    // Arma base
    static BASE_ENEMY_ID = 0;
    static BASE_TURRET_ID = 1;
    static BASE_2ENEMY_ID = 2;
    static SLOW_TURRET = 3;
    static FINAL_BOSS = 4;

    constructor(){
        throw new Error('La clase \'WeaponFactory\' no se puede y no se debe instanciar');
    }

    static createEnemy(enemmyID, scene, x, y){

        switch(enemmyID){
        case EnemyFactory.BASE_ENEMY_ID:
            return new ExtendedEnemy(scene, x, y) 
        case EnemyFactory.BASE_TURRET_ID:
            return new BaseTurret(scene, x, y);  
        case EnemyFactory.BASE_2ENEMY_ID:
            return new Extended2Enemy(scene, x, y) 
        case EnemyFactory.SLOW_TURRET:
            return new SlowTurret(scene, x, y) 
        case EnemyFactory.FINAL_BOSS:
            return new FinalBoss(scene, x, y) 
            
        default:
            throw new Error(`Objeto \'Weapon\' con identificador ${enemmyID} no encontrado`)
        }
    }
}