import Object from '../base-game-objects/Object.js'

export default class Coin extends Object {

    static VELOCITY = 10
    static MINIMUM_DISTANCE_TO_PICKUP = 20
    static MONEY_VALUE = 25

    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite, 250)

    }

    player_overlaps(player){

        player.receiveMoney(Coin.MONEY_VALUE)
        this.destroyObject()
    }

}