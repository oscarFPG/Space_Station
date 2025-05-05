import BasedEnemy from '../base-game-objects/BaseEnemy.js'
import ClassIA from '../../factories/ClassIA.js';
import Builder from '../../managers/Builder.js';
import WeaponFactory from '../../factories/WeaponFactory.js';

export default class BaseTurret extends BasedEnemy {

    static VIDA = 25
    static SPEED = 10

    constructor(scene, x, y){
        super(scene, x, y, {texture: Builder.BASE_TURRET_TEXTURE, x: 30, y: 30}, BaseTurret.VIDA, BaseTurret.SPEED)
        this._enemyParameters.weapon.rotation = Phaser.Math.DegToRad(90); // Rota 90 grados

        this.body.setSize(80, 78);
        this.body.setImmovable(true);             // No se moverá por colisiones
        this.body.moves = false;                  // No se moverá nunca, ni por fuerzas ni manualmente
        this.body.setVelocity(0, 0);              // Por seguridad, velocidad 0
        this.body.setAllowGravity(false);         // Si estás usando gravedad
        this.body.setCollideWorldBounds(false);

        // Propiedades de la IA
        this._enemyParameters.state = 'patrol';

        this._enemyParameters.minDistance = 150; 
        this._enemyParameters.visionRange = 1100          
        this._enemyParameters.shootingRange = 650;             
        this._enemyParameters.direction = new Phaser.Math.Vector2(1, 0); 

        // Propiedades para el dodge(IA)
        this._enemyParameters.dodgeIntensity = 50;        
        this._enemyParameters.lastDodgeSwitch = 0;       
        this._enemyParameters.dodgeSwitchInterval = 1500; 
        this._enemyParameters.dodgeDirection = 1; 

        // --- Dibujo del rango ---
        // En lugar de agregar el Graphics directamente a la escena, lo agregamos como hijo del Container
        this.rangeGraphic = this.scene.add.graphics();
        // Opcional: aumentamos el alpha (por ejemplo, 0.4 para ver más)
        this.rangeGraphic.fillStyle(0xff0022, 0.05);
        // Dibujar el círculo centrado en el contenedor
        this.rangeGraphic.fillCircle(0, 0, this._enemyParameters.shootingRange);
        // Agregar el gráfico al contenedor (la torreta)
        this.add(this.rangeGraphic);
        // Opcional: colocar el gráfico detrás de la torreta, ajustando su depth relativo
        this.rangeGraphic.setDepth(-1);
    }
    
    quitarVida(cantidad){
        return
    }
    
    preUpdate(time, delta) {
        ClassIA.buscaJugadorEstatico(time, this, this.scene._player);
    }

    add_weapon(){
        return WeaponFactory.crearArma(WeaponFactory.BASE_TURRET_WEAPON, this.scene, {x: 40, y: 50})
    }
}