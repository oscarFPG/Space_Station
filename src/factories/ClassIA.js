import Phaser from 'phaser';

export default class ClassIA {

    //  Identificadores para evitar 'numeros magicos'

    constructor(){
        throw new Error('La clase \'ClassIA\' no se puede y no se debe instanciar');
    }
    
    // ------------------------------------------------ Metodos de tipo de IA ------------------------------------------------ //
    static buscaJugador(time, enemy, player){

        const distanceToPlayer = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);

        if (distanceToPlayer <= enemy._enemyParameters.visionRange) {
            enemy._enemyParameters.state = 'perseguir';
            this.logicPersigue(time, enemy, player, distanceToPlayer);
        }
        else /*if (enemy._enemyParameters.state === 'perseguir')*/ {
            enemy._enemyParameters.state = 'patrullar';
            this.logicPatrulla(enemy);
        }
    }

    static buscaJugadorEstatico(time, enemy, player){

        const distanceToPlayer = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);

        if (distanceToPlayer <= enemy._enemyParameters.visionRange) {
            enemy._enemyParameters.state = 'disparar';
            this.logicPersigueEstatico(time, enemy, player, distanceToPlayer);
        }
        else /*if (enemy._enemyParameters.state === 'perseguir')*/ {
            enemy._enemyParameters.state = 'patrullar';
        }
    }

    //static patrullaArea(){}
    // ------------------------------------------------ Metodos de tipo de IA ------------------------------------------------ //

    // -------------------------------------------------- Metodos de logica -------------------------------------------------- //
    static logicPersigue(time, enemy, player, distanceToPlayer) {

        const chaseAngle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        
        if (time > enemy._enemyParameters.lastDodgeSwitch + enemy._enemyParameters.dodgeSwitchInterval) {
            enemy._enemyParameters.dodgeDirection = Math.random() < 0.5 ? 1 : -1;
            enemy._enemyParameters.lastDodgeSwitch = time;
        }

        // Determinar velocidad base según la distancia:
        let baseVX = 0, baseVY = 0;
        if (distanceToPlayer > enemy._enemyParameters.shootingRange) {

            baseVX = Math.cos(chaseAngle) * enemy._atributos.speed;
            baseVY = Math.sin(chaseAngle) * enemy._atributos.speed;
        }
        else if (distanceToPlayer < enemy._enemyParameters.minDistance) {

            const retreatAngle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
            baseVX = Math.cos(retreatAngle) * enemy._atributos.speed;
            baseVY = Math.sin(retreatAngle) * enemy._atributos.speed;
        }

        // Movimiento evasivo (perpendicular al jugador)
        const perpendicularAngle = chaseAngle + enemy._enemyParameters.dodgeDirection * (Math.PI / 2);
        const dodgeVX = Math.cos(perpendicularAngle) * enemy._enemyParameters.dodgeIntensity;
        const dodgeVY = Math.sin(perpendicularAngle) * enemy._enemyParameters.dodgeIntensity;

        // Aplicar velocidad
        enemy.body.setVelocity(baseVX + dodgeVX, baseVY + dodgeVY);

        if (enemy.light) {
            enemy.light.setPosition(enemy.x, enemy.y);  // Actualizar posición de la luz
        }
        // Disparar si está en rango
        if (distanceToPlayer <= enemy._enemyParameters.shootingRange) {
            if(enemy._enemyParameters.weapon._ammo.currentClipAmmo <= 0)
                enemy._enemyParameters.weapon.reload();
            else if(!enemy.getIsDead())
                enemy._enemyParameters.weapon.shot(player.x, player.y);
        }
        enemy._enemyParameters.weapon.setRotation(chaseAngle);

        this.flipCharacter(enemy, player.x);
    }

    static logicPatrulla(enemy){
      
        if (enemy.body.blocked.left || enemy.body.blocked.right || enemy.body.blocked.up || enemy.body.blocked.down) {//Actualizar
            enemy._enemyParameters.direction = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 1);
        }
        enemy.body.setVelocity(
            enemy._enemyParameters.direction.x * enemy._atributos.speed,
            enemy._enemyParameters.direction.y * enemy._atributos.speed
        );
        const patrolAngle = Phaser.Math.Angle.Between(0, 0, enemy._enemyParameters.direction.x, enemy._enemyParameters.direction.y);
        enemy._enemyParameters.weapon.setRotation(patrolAngle);

        this.flipCharacter(enemy);
    }

    static logicPersigueEstatico(time, enemy, player, distanceToPlayer) {
        const chaseAngle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        if (distanceToPlayer <= enemy._enemyParameters.shootingRange) {
            if(enemy._enemyParameters.weapon._ammo.currentClipAmmo <= 0)
                enemy._enemyParameters.weapon.reload();
            else if(!enemy.getIsDead())
                enemy._enemyParameters.weapon.shot(player.x, player.y);
        }
        enemy._enemyParameters.weapon.setRotation(chaseAngle);
    }
    // -------------------------------------------------- Metodos de logica -------------------------------------------------- //

    // -------------------------------------------------- Metodos Agregados -------------------------------------------------- //
    static flipCharacter(enemy, playerEjex) {
        // Si el objetivo (player) está a la izquierda del enemigo, se activa el flip
        let shouldFlip = playerEjex < enemy.x;
        
        enemy._enemyParameters.weapon.setFlipY(shouldFlip);
        // Ajuste en la posición del sprite del enemigo si se voltea, similar a lo que hace el player
        if (shouldFlip) {
            enemy._sprite.setX(34);
        } 
        enemy._sprite.setFlipX(shouldFlip);
    }
    
    // -------------------------------------------------- Metodos Agregados -------------------------------------------------- //

}