
export default class Block {

    constructor(x, y, width, height){
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._canBeBroken = false;
    }

    setCanBeBroken(state){
        
        if(typeof(state) !== 'boolean')
            throw new Error('El campo \`_canBeBroken\` solo admite el tipo boolean')
    
        this._canBeBroken = state;
    }

}