import Phaser from 'phaser';
import BaseActor from './BaseActor';

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
        super(scene, x, y, sprite, vida, speed)
        this.body.setSize(66, 78);
        this.body.setCollideWorldBounds(true)

        this._enemyParameters.weapon = this.add_weapon()
        this._enemyParameters.weapon.setPipeline('Light2D');
        this.add(this._enemyParameters.weapon)
    }

    add_weapon(){
        throw new Error('El metodo `add_weapon` debe sobreescribirse')
    }

}