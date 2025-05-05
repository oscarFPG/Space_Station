import Phaser from 'phaser'
import Object from '../base-game-objects/Object.js'
import Builder from '../../managers/Builder.js'

export default class Laser extends Object {
    static DEFAULT_DAMAGE = 5

    constructor(scene, x, y, ID, isHorizontal, isStatic) {
        var texture = (!isHorizontal) ? Builder.OBJ_LASER_VERTICAL: Builder.OBJ_LASER_HORIZONTAL;
        super(scene, x, y, texture, false)
        this.body.setOffset(0, 0)
        if (!isHorizontal)
            this.body.setSize(20, 110)
        else 
            this.body.setSize(110, 20)

        this._laserID = ID
        this.isStatic = isStatic
    }

    accion(player) {    
        player.quitarVida(Laser.DEFAULT_DAMAGE);
    
        //Dirección opuesta a la actual
        const direction = new Phaser.Math.Vector2(player.body.velocity.x, player.body.velocity.y);
        if (direction.length() === 0) {
            direction.set(0, 1); // Por defecto empuje hacia abajo si está quieto
        } else {
            direction.normalize();
        }
        const knockbackDistance = 100;
        const knockbackDuration = 300;
    
        this.scene.tweens.add({
            targets: player,
            x: player.x - direction.x * knockbackDistance,
            y: player.y - direction.y * knockbackDistance,
            ease: 'Quad.easeOut',
            duration: knockbackDuration
        });
    
        this.scene.tweens.add({
            targets: player,
            alpha: 0,
            yoyo: true,
            repeat: 2,
            duration: 100,
            onComplete: () => {
                player.setAlpha(1);
            }
        });
    }
    
    

    activate_laser(){
        this.body.checkCollision.none = false
        this.setAlpha(1)
    }   

    disable_laser(){
        this.body.checkCollision.none = true
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 1000
        })
    }

    get_laser_ID(){ return this._laserID }
    get_laser_isStatic(){ return this.isStatic }
}
