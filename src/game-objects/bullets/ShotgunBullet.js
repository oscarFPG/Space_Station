import Phaser, { Math } from 'phaser'
import Builder from '../../managers/Builder.js'
import Bullet from '../base-game-objects/Bullet.js'


export default class ShotgunBullet extends Bullet {

    #firstPos

    constructor(scene, x, y, damage, maxDistance){
        super(scene, x, y, Builder.AMMO_BASE, damage)
        console.log('shotgun')

        this._maxDistance = maxDistance
    }

    preUpdate(time, delta){

        // Guardar la posicion de la bala cuando aparezca por primera vez
        if(!this.#firstPos)
            this.#firstPos = Object.freeze({x: this.x, y: this.y})   // Crear objeto constante

        // Calcular distancia recorrida
        const x = this.x
        const y = this.y
        const distancia = Math.Distance.Between(x, y, this.#firstPos.x, this.#firstPos.y)

        if(this._maxDistance <= distancia)
            this.destroy()
    }

}