import CharacterIdle from '../../assets/sprites/idle.png'
import CharacterRunning from '../../assets/sprites/running.png'
import OldColt from '../../assets/weapons/OldColt.png'
import Weapon1 from '../../assets/weapons/weapon1.png'
import Weapon2 from '../../assets/weapons/weapon2.png'
import Weapon3 from '../../assets/weapons/weapon3.png'
import Weapon4 from '../../assets/weapons/weapon4.png'
import Bullet1 from '../../assets/bullets/bullet1.png'
import Explode from '../../assets/effects/explode.png'
import TilemapImage from '../../assets/blocks/Tilemap.png'
import Map from '../../assets/maps/map1.json'
import Player from '../game-objects/Player.js'
import DungeonGenerator from '../dungeon/dungeonGenerator.js'
import Phaser from 'phaser'


export default class Tutorial extends Phaser.Scene {

    constructor(){
        super({ key: 'tutorial' })
    }

    preload(){

        // Images
        this.load.image('tiles', TilemapImage);
        this.load.image('baseWeapon', OldColt);
        this.load.image('weapon1', Weapon1);
        this.load.image('weapon2', Weapon2);
        this.load.image('weapon3', Weapon3);
        this.load.image('weapon4', Weapon4);
        this.load.image('bullet1', Bullet1);
        this.load.tilemapTiledJSON('map', Map);
        
        // Spritesheets
        this.load.spritesheet('playerIdle', CharacterIdle, { frameWidth: 185 , frameHeight: 180 });
        this.load.spritesheet('playerRunning', CharacterRunning, { frameWidth: 185 , frameHeight: 180 });
        this.load.spritesheet('explode', Explode, { frameWidth: 285 , frameHeight: 285 });
    }

    create(){

        var map = this.make.tilemap({key: 'map', tileWidth: 185, tileHeight: 185});
        var tileset = map.addTilesetImage('Tilemap', 'tiles');   
        var layer = map.createLayer('topLayer', tileset, 0, 0);
        var layerWall = map.createLayer('Wall', tileset, 0, 0);
        this.player = new Player(this, 200, 200);

        this.testDungeon();

        // Asegurar que el jugador no salga de los límites del mundo
        // Ajustar los límites del mundo al tamaño del mapa
        this.physics.add.collider(this.player, layer);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player.body.setCollideWorldBounds(true);

        // Ajustar límites de la cámara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Crear colisiones entre el jugador y las paredes
        this.physics.add.collider(this.player, layerWall);

        // Hacer que la cámara siga al jugador
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.6);

        // Crear el grupo global de balas
        this.bullets = this.physics.add.group();
        this.physics.add.collider(this.bullets, layerWall, (bullet, wall) => {
            bullet.createSpark(bullet.x, bullet.y);
            bullet.destroy();
        });

        // Crear la animación de la chispa (si no existe)
        if (!this.anims.exists('spark')) {
            this.anims.create({
                key: 'spark',
                frames: this.anims.generateFrameNumbers('explode', { start: 0, end: 7 }),
                frameRate: 20,
                repeat: 0
            });
        }

        // Crear cursor personalizado
        this.input.setDefaultCursor('crosshair')

        // Temporal!!!
        // Custom event for ENTER key
        this.p_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    }
    
    update(){

        // Cambiar escena store
        if(Phaser.Input.Keyboard.JustDown(this.p_key)){
            this.scene.switch('store', 'tutorial');
        } 
    }

    testDungeon(){
        
        var dungeon = DungeonGenerator.createDungeon();
        console.log(dungeon);
    }

}