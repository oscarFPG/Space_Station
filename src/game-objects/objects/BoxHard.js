import Builder from '../../managers/Builder.js';
import Box from './Box.js'
export default class BoxHard extends Box {
    
    constructor(scene, x, y) {
        super(scene, x, y, Builder.OBJ_CAJA2, false)
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
}