import Phaser from 'phaser'


export default class Enemy extends Phaser.GameObjects.Container {

    constructor(scene, x, y){
        super(scene, x, y);

        this._velocity = 20;
        this._lastDirection = new Phaser.Math.Vector2(0, 0);
        this._currentDirection = new Phaser.Math.Vector2(0, 0);
        this._sprite = this.scene.add.sprite(x, y, '', '');
        this._time = 0;
        this.add(this._sprite);
        this.scene.add.existing(this);
        this.addToUpdateList(); // Allow updating
    }

    preUpdate(time, delta){
        this._time += delta;
        if(this._time >= 2000){
            this._time = 0;
            this.moveRandomly();
        }
    }

    stopMoving(){
        this._lastDirection = this._currentDirection;
        this._currentDirection.x = 0;
        this._currentDirection.y = 0;
    }

    moveLeft(){
        this._lastDirection = this._currentDirection;
        this._currentDirection.x = -1;
        this._currentDirection.y = 0;
    }

    moveRight(){
        this._lastDirection = this._currentDirection;
        this._currentDirection.x = 1;
        this._currentDirection.y = 0;
    }

    moveUp(){
        this._lastDirection = this._currentDirection;
        this._currentDirection.x = 0;
        this._currentDirection.y = -1;
    }

    moveDown(){
        this._lastDirection = this._currentDirection;
        this._currentDirection.x = 0;
        this._currentDirection.y = 1;
    }

    moveRandomly(){

        let i = Phaser.Math.Between(0, 4);
        switch(i){
        case 0:
            this.moveLeft();
            break;

        case 1:
            this.moveUp();
            break;
    
        case 2:
            this.moveRight();
            break;

        case 3:
            this.moveDown();
            break;
        
        default:
            this.stopMoving();
            break;
        }
    }

}