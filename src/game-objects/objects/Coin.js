import Interactive from '../base-game-objects/Interactive.js'

export default class Coin extends Interactive {

    static VELOCITY = 10
    static MINIMUM_DISTANCE_TO_PICKUP = 20
    static MONEY_VALUE = 25

    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite, 250)

    }

    preUpdate(time, delta){

        const player = this.scene.get_player()
        if(!player)
            return

        if(this.esta_dentro(player.x, player.y))
            this.accion(player)
    }

    accion(gameobject){

        if(gameobject.receiveMoney){
            gameobject.receiveMoney(Coin.MONEY_VALUE)
            this.destroyObject()
        }
    }

}