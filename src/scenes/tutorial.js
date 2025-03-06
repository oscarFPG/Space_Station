import Phaser from 'phaser'
import Player from '../game-objects/Player.js'
import Bullet from '../base-game-objects/Bullet.js'
import Enemy from '../base-game-objects/Enemy.js'
import Note from '../base-game-objects/Note.js';
import Console from '../base-game-objects/Console.js';
import Laser from '../base-game-objects/Laser.js';

export default class Tutorial extends Phaser.Scene {

    constructor(){
        super({ key: 'tutorial' })
    }

    create(){

        // Creacion assets
        var map = this.make.tilemap({key: 'map', tileWidth: 111, tileHeight: 111});
        var tileset = map.addTilesetImage('tilemap', 'tiles');   
        var layerFloor = map.createLayer('floor', tileset, 0, 0);
        var layerWall = map.createLayer('wall', tileset, 0, 0);
        var layerButano = map.createLayer('butano', tileset, 0, 0);
        var layerExtra = map.createLayer('extra', tileset, 0, 0);
        //Obtencion de objetos desde el mapa
        const objectsLayer = map.getObjectLayer('objects');
        
        // Configurar iluminación
        layerFloor.setPipeline('Light2D');
        layerWall.setPipeline('Light2D');
        layerButano.setPipeline('Light2D');
        this.lights.enable();
        this.lights.setAmbientColor(0x888888);

        // Crear cursor personalizado
        this.input.setDefaultCursor('crosshair')

        //Creacion variable para que no haya clicks mientras estas en consola
        this.consoleActive = false; // Indica que la consola no está abierta al inicio
        // Personajes del juego
        this.player = new Player(this, 1000, 1000);
        this.enemy = new Enemy(this, 1500, 1500);

        // Configurar camara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        // Configurar colisiones
        this.physics.add.collider(this.player, layerFloor);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player.body.setCollideWorldBounds(true);   // Asegurar que el jugador no salga de los límites del mundo
        this.enemy.body.setCollideWorldBounds(true);
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
        this.physics.add.collider(this.player, this.butanoColliders);
        this.physics.add.collider(this.enemy, this.butanoColliders);

        // Crear colisiones entre el jugador y las paredes
        this.physics.add.collider(this.player, layerWall);
        this.physics.add.collider(this.enemy, layerWall);

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

            if (target === this.enemy) {
                this.enemy.receiveDamage(5);
            }

            if (bullet && typeof bullet.createSpark === 'function') {
                bullet.createSpark(bullet.x, bullet.y);
                bullet.destroy();
            }
        };
        this.physics.add.collider(this.bullets, layerWall, onBulletCollision);
        this.physics.add.collider(this.bullets, this.player, onBulletCollision);
        this.physics.add.collider(this.bullets, this.enemy, onBulletCollision);
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

        // Temporal!!!
        // Custom event for ENTER key
        this.p_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.createMushroom(map);
        
    }
    createMushroom(map) 
    { 
        this.notes = map.createFromObjects('objects', { gid: 11, classType: Note, key: 'note'});
        this.lasers = map.createFromObjects('objects', { gid: 40, classType: Laser, key: 'laser2'});
        this.consolesOff = map.createFromObjects('objects', { gid: 42, classType: Console, key: 'consoleBlocked'});
        this.notes.forEach(note => {
            note.configure(this.player);
          });
        this.consolesOff.forEach(console => {
            console.configure(this.player, this.lasers);
        });
        this.lasers.forEach(laser => {
            this.physics.add.overlap(this.player, laser, this.onLaserHit, null, this);
        });
        
    }
    onLaserHit(player, laser) {
        player.receiveDamage(200);
    }
    update(){
        // Cambiar escena store
        this.notes.forEach(note => {
            note.update();
          });
        this.consolesOff.forEach(console => {
            console.update();
        });
        if(Phaser.Input.Keyboard.JustDown(this.p_key)){
            this.scene.switch('store', 'tutorial');
        } 
    }

}