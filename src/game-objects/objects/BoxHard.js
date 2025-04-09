import Box from './Box.js'
export default class BoxHard extends Box {
    
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite)
        this._vida += Box.VIDA_INICIAL;
    }
    quitarVida(cantidad){
        if(cantidad >= Box.VIDA_INICIAL) {
            this._vida -= cantidad
            this.setTintFill(0xffffff);
            this.scene.time.delayedCall(60, () => {
                this.clearTint();
            })
        }
		if(this._vida <= 0)
            this.destroyObject()
    }

    destroyObject(){
        this.play('broken_box')
        this.body.checkCollision.none = true;
    }
}