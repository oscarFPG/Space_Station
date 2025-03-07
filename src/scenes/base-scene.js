import Phaser from 'phaser'
import Player from '../game-objects/characters/Player.js'
import Bullet from '../base-game-objects/Bullet.js'
import Enemy from '../base-game-objects/Enemy.js'

export default class BaseScene extends Phaser.Scene {

    constructor(sceneKey){
        super({ key: sceneKey })
    }


    // IMPORTANTE - cualquier escena que herede de esta clase debe invocar 
    // SIEMPRE esta funcion con super.create() y SIEMPRE AL PRINCIPIO
    // NO cambiar el orden
    create(){

        this.config_gameObjects()
        this.config_mapa()
        this.config_camaras()
        this.config_iluminacion()
        this.config_fisicas()
        this.config_layers()
        this.config_cursor()
        this.config_colisiones()
        this.config_inputs()
        this.config_eventos()

        // Mapa
        var tileset = this._map.addTilesetImage('tilemap', 'tiles');   
        var layerFloor = this._map.createLayer('floor', tileset, 0, 0);
        var layerWall = this._map.createLayer('wall', tileset, 0, 0);
        var layerButano = this._map.createLayer('butano', tileset, 0, 0);
        var layerExtra = this._map.createLayer('extra', tileset, 0, 0);
        const objectsLayer = this._map.getObjectLayer('objects');

        // Configurar iluminación
        layerFloor.setPipeline('Light2D');
        layerWall.setPipeline('Light2D');
        layerButano.setPipeline('Light2D');
        

        // Configurar colisiones
        this.physics.add.collider(this._player, layerFloor);
        this.physics.world.setBounds(0, 0, this._map.widthInPixels, this._map.heightInPixels);
        this._player.body.setCollideWorldBounds(true);   // Asegurar que el jugador no salga de los límites del mundo
        this._enemy.body.setCollideWorldBounds(true);
        layerWall.setCollisionByExclusion([-1]);
        layerButano.setCollisionByExclusion([-1]); // Activa colisiones en la capa
        this.butanoColliders = this.physics.add.staticGroup();
        //Instancias de objetos sacados del mapa: 
            
        layerButano.forEachTile(tile => {
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
        this.physics.add.collider(this._player, this.butanoColliders);
        this.physics.add.collider(this._enemy, this.butanoColliders);

        // Crear colisiones entre el jugador y las paredes
        this.physics.add.collider(this._player, layerWall);
        this.physics.add.collider(this._enemy, layerWall);

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
            if (target === this._player) {
                this._player.receiveDamage(5);
            }

            if (target === this._enemy) {
                this._enemy.receiveDamage(5);
            }

            if (bullet && typeof bullet.createSpark === 'function') {
                bullet.createSpark(bullet.x, bullet.y);
                bullet.destroy();
            }
        };
        this.physics.add.collider(this.bullets, layerWall, onBulletCollision);
        this.physics.add.collider(this.bullets, this._player, onBulletCollision);
        this.physics.add.collider(this.bullets, this._enemy, onBulletCollision);
        this.physics.add.collider(this.bullets, this.butanoColliders, onBulletCollision);
    }


        config_gameObjects(){

        this._player = new Player(this, 1000, 1000);
        this._enemy = new Enemy(this, 1500, 1500);
    }

    config_camaras(){
        this.cameras.main.setBounds(0, 0, this._map.widthInPixels, this._map.heightInPixels);
        this.cameras.main.startFollow(this._player);
    }

    config_iluminacion(){
        this.lights.enable();
        this.lights.setAmbientColor(0x888888);
    }

    config_fisicas(){

    }

    config_layers(){

    }

    config_mapa(){
        this._map = this.make.tilemap({key: 'map', tileWidth: 111, tileHeight: 111});
    }

    config_cursor(){
        this.input.setDefaultCursor('crosshair')
    }

    config_colisiones(){

    }

    config_inputs(){

    }

    config_eventos(){

    }

}