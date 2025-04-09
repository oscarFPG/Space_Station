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
        this._enemyParameters.weapon.setPipeline('Light2D');
        this.add(this._enemyParameters.weapon)
    }
    /*
    preUpdate(time, delta) {}
    /**/
}