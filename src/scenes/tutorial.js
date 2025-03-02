// Animaciones
import CharacterIdle from '../../assets/sprites/idle_new.png'
import CharacterRunning from '../../assets/sprites/running_new.png'
import EnemyIdle from '../../assets/sprites/idle_enemy_new.png'

// Armas / Objetos
import OldColt from '../../assets/weapons/OldColt.png'
import Weapon1 from '../../assets/weapons/weapon1.png'
import Weapon2 from '../../assets/weapons/weapon2.png'
import Weapon3 from '../../assets/weapons/weapon3.png'
import Weapon4 from '../../assets/weapons/weapon4.png'
import Bullet1 from '../../assets/bullets/bullet1.png'
import Explode from '../../assets/effects/explode.png'

// Mapas
import TilemapImage from '../../assets/blocks/tilemap.png'
import Map from '../../assets/maps/map1.json'

//Objetos 
import Paper from '../../assets/blocks/paper.png'
import ConsoleBlocked from '../../assets/blocks/panel_off.png'
import laserUp from '../../assets/blocks/laser_2.png'
import laserDown from '../../assets/blocks/laser_1.png'

// Jugador
import Player from '../game-objects/Player.js'
import Bullet from '../base-game-objects/Bullet.js'
import Enemy from '../base-game-objects/Enemy.js'
import Note from '../base-game-objects/Note.js';
import Console from '../base-game-objects/Console.js';
import Laser from '../base-game-objects/Laser.js';

// Interfaces
import PlayerHealth from '../../assets/ui/HealthBar.png'
import Phaser from 'phaser'




export default class Tutorial extends Phaser.Scene {

    constructor(){
        super({ key: 'tutorial' })
    }

    preload(){

        // Images
        this.load.image('tiles', TilemapImage);
        this.load.image('baseWeapon', OldColt);
        this.load.image('note', Paper);
        this.load.image('laser2', laserUp);
        this.load.image('laser1', laserDown);
        this.load.image('consoleBlocked', ConsoleBlocked);
        this.load.image('weapon1', Weapon1);
        this.load.image('weapon2', Weapon2);
        this.load.image('weapon3', Weapon3);
        this.load.image('weapon4', Weapon4);
        this.load.image('bullet1', Bullet1);
        this.load.image('playerUI', PlayerHealth);
        this.load.tilemapTiledJSON('map', Map);
        
        // Spritesheets
        this.load.spritesheet('playerIdle', CharacterIdle, { frameWidth: 111 , frameHeight: 108 });
        this.load.spritesheet('playerRunning', CharacterRunning, { frameWidth: 111 , frameHeight: 108 });
        this.load.spritesheet('explode', Explode, { frameWidth: 285 , frameHeight: 285 });
        this.load.spritesheet('enemyIdle', EnemyIdle, { frameWidth: 111 , frameHeight: 108 });
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