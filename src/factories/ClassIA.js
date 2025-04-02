import Phaser from 'phaser';

export default class ClassIA {

    //  Identificadores para evitar 'numeros magicos'

    constructor(){
        throw new Error('La clase \'ClassIA\' no se puede y no se debe instanciar');
    }

    // Metodos de instanciamiento 
    static buscaJugador(scene, enemy, player){

        const playerX = player.x;
        const playerY = player.y;
        const distanceToPlayer = Phaser.Math.Distance.Between(enemy.x, enemy.y, playerX, playerY);

        if (distanceToPlayer <= enemy._enemyParameters.visionRange) {
            enemyParameters.state = 'perseguir';
            ClassIA.logicPersigue();
        }
        else if (enemyParameters.state === 'perseguir') {
            enemyParameters.state = 'patrullar';
            ClassIA.logicPatrulla();
        }
    }

    //static patrullaArea(){}

    // Metodos de logica
    static logicPersigue(){}

    static logicPatrulla(){
      
        if (this.body.blocked.left || this.body.blocked.right || this.body.blocked.up || this.body.blocked.down) {//Actualizar
            this.patrolDirection = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 1);
        }
        this.body.setVelocity(
            this.patrolDirection.x * this._atributos.speed,
            this.patrolDirection.y * this._atributos.speed
        );
        const patrolAngle = Phaser.Math.Angle.Between(0, 0, this.patrolDirection.x, this.patrolDirection.y);
        this._weapon.setRotation(patrolAngle);

        if (this.patrolDirection.x < 0) {
            this._sprite.setFlipX(true);
            this._weapon.setFlipY(true);
            this._sprite.setX(34);
        } else if (this.patrolDirection.x > 0) {
            this._sprite.setFlipX(false);
            this._weapon.setFlipY(false);
        }
        
    }

}