import Phaser from 'phaser'
import Player from '../game-objects/characters/Player.js'
import Enemy from '../base-game-objects/Enemy.js'
import Bullet from '../base-game-objects/Bullet.js'

export default class BaseScene extends Phaser.Scene {

    static KEY = '' // Clave de la escena

    static LAYER_SUELO = 'floor'
    static LAYER_PARED = 'wall'
    static LAYER_OBJETO = 'butano'
    static LAYER_PERSONAJE = 'Personaje'
    static LAYER_UI = 'UI'

    /*
        TODO ¿¿CREAR UN GRUPO POR CAPA PARA AÑADIR OBJETOS A ESTA Y CONFIGURAR COLISIONES DE MANERA ESTATICA ENTRE GRUPOS??    
    */

    constructor(sceneKey){
        super({ key: sceneKey })
        BaseScene.KEY = sceneKey
    }


    // IMPORTANTE - cualquier escena que herede de esta clase debe invocar 
    // SIEMPRE esta funcion con super.create()
    create(map, tileset){

        // Capas de todos los niveles
        var layerSuelo = map.createLayer(BaseScene.LAYER_SUELO, tileset, 0, 0)
        var layerPared = map.createLayer(BaseScene.LAYER_PARED, tileset, 0, 0)
        var layerObjeto = map.createLayer(BaseScene.LAYER_OBJETO, tileset, 0, 0)
        var layerPersonaje = map.createLayer(BaseScene.LAYER_PERSONAJE, tileset, 0, 0)
        var layerUI = map.createLayer(BaseScene.LAYER_UI, tileset, 0, 0)

        // Colisiones
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Crear personajes y colisiones
        this.player = this.config_jugador()
        var enemigos = this.config_enemigos()
        
        // Configuraciones generales
        this.config_iluminacion([layerSuelo, layerPared, layerObjeto])
        this.config_camara(this.player)
        this.config_cursor()

        // Configurar colisiones
        layerPared.setCollisionByExclusion([-1])
        layerObjeto.setCollisionByExclusion([-1])
        this.physics.add.collider(this.player, layerPared)
        this.physics.add.collider(this.player, layerSuelo)
        this.physics.add.collider(enemigos[0], layerPared)
        this.physics.add.collider(enemigos[0], layerSuelo)
        this.butanoColliders = this.physics.add.staticGroup();
        layerObjeto.forEachTile(tile => {
            if (tile.index !== -1) {

                const baseX = tile.getCenterX();
                const baseY = tile.getCenterY();
                const offsetX = 4;
                const offsetY = -1;

                // Crear el collider en la posición ajustada
                const collider = this.physics.add.staticImage(baseX + offsetX, baseY + offsetY, null);
                collider.body.setSize(54, 90);
                collider.setVisible(false);
                this.butanoColliders.add(collider);
            }
        });
        this.physics.add.collider(this.player, this.butanoColliders);
        this.physics.add.collider(enemigos[0], this.butanoColliders);

        // Crear el grupo global de balas
        this.bullets = this.physics.add.group();
        const onBulletCollision = (obj1, obj2) => {

            let bullet = null;
            let target = null;
            if (obj1 instanceof Bullet) {
                bullet = obj1;
                target = obj2;
            } else if (obj2 instanceof Bullet) {
                bullet = obj2;
                target = obj1;
            }
            
            // Si el target es el jugador, se activa la animación de impacto
            if (target === this.player) {
                this.player.receiveDamage(5);
            }

            if (target === enemigos[0]) {
                enemigos[0].receiveDamage(5);
            }

            if (bullet && typeof bullet.createSpark === 'function') {
                bullet.createSpark(bullet.x, bullet.y);
                bullet.destroy();
            }
        };
        this.physics.add.collider(this.bullets, layerPared, onBulletCollision);
        this.physics.add.collider(this.bullets, this.player, onBulletCollision);
        this.physics.add.collider(this.bullets, enemigos[0], onBulletCollision);
        this.physics.add.collider(this.bullets, this.butanoColliders, onBulletCollision);

        // Crear la animación de la chispa (si no existe)
        if (!this.anims.exists('spark')) {
            this.anims.create({
                key: 'spark',
                frames: this.anims.generateFrameNumbers('explode', { start: 0, end: 7 }),
                frameRate: 30,
                repeat: 0
            });
        }

        this.scene.launch('')
    }


    config_jugador(){

        var player = new Player(this, 1000, 1000)
        player.body.setCollideWorldBounds(true)
        player.body.setImmovable(true)

        return player
    }

    config_enemigos(){

        var enemigos = []
        var unEnemigo = new Enemy(this, 1500, 1500)
        unEnemigo.body.setCollideWorldBounds(true)
        unEnemigo.body.setImmovable(true)

        enemigos.push(unEnemigo)

        return enemigos
    }

    config_iluminacion(capas){

        for(let i = 0; i < capas.length; i++)
            capas[i].setPipeline('Light2D')

        this.lights.enable();
        this.lights.setAmbientColor(0x888888);
    }

    config_cursor(){
        this.input.setDefaultCursor('crosshair')
    }

    config_camara(player){
        this.cameras.main.startFollow(player);
    }

}