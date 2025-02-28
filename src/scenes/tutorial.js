
// Animaciones
import CharacterIdle from '../../assets/sprites/idle.png'
import CharacterRunning from '../../assets/sprites/running.png'

// Armas / Objetos
import OldColt from '../../assets/weapons/OldColt.png'
import Weapon1 from '../../assets/weapons/weapon1.png'
import Weapon2 from '../../assets/weapons/weapon2.png'
import Weapon3 from '../../assets/weapons/weapon3.png'
import Weapon4 from '../../assets/weapons/weapon4.png'
import Bullet1 from '../../assets/bullets/bullet1.png'
import Explode from '../../assets/effects/explode.png'

// Mapas
import TilemapImage from '../../assets/blocks/Tilemap.png'
import Map from '../../assets/maps/map2.json'

// Jugador
import Player from '../game-objects/Player.js'

// Interfaces
import PlayerUI from '../UI/PlayerUI.js'
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

        // UI
        this.scene.add('playerUI', PlayerUI, true);

    }

    create(){

        // Creacion assets
        var map = this.make.tilemap({key: 'map', tileWidth: 185, tileHeight: 185});
        var tileset = map.addTilesetImage('Tilemap', 'tiles');   
        var layerFloor = map.createLayer('Ground', tileset, 0, 0);
        var layerWall = map.createLayer('Wall', tileset, 0, 0);
        var layerButano = map.createLayer('Butanos', tileset, 0, 0);
        
        // Configurar iluminación
        layerFloor.setPipeline('Light2D');
        layerWall.setPipeline('Light2D');
        layerButano.setPipeline('Light2D');
        this.lights.enable();
        this.lights.setAmbientColor(0x888888);

        // Crear cursor personalizado
        this.input.setDefaultCursor('crosshair')

        // Creacion personaje
        this.player = new Player(this, 450, 450);
        
        // Configurar camara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        // Configurar colisiones
        this.physics.add.collider(this.player, layerFloor);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player.body.setCollideWorldBounds(true);   // Asegurar que el jugador no salga de los límites del mundo
        layerWall.setCollisionByExclusion([-1]);
        layerButano.setCollisionByExclusion([-1]); // Activa colisiones en la capa
        this.butanoColliders = this.physics.add.staticGroup();

        layerButano.forEachTile(tile => {
            if (tile.index !== -1) {

                const baseX = tile.getCenterX();
                const baseY = tile.getCenterY();
                const offsetX = 10;
                const offsetY = -5;

                // Crear el collider en la posición ajustada
                const collider = this.physics.add.staticImage(baseX + offsetX, baseY + offsetY, null);
                collider.body.setSize(90, 150);
                collider.setVisible(false);
                this.butanoColliders.add(collider);
            }
        });
        this.physics.add.collider(this.player, this.butanoColliders);

        // Crear colisiones entre el jugador y las paredes
        this.physics.add.collider(this.player, layerWall);

        // Crear el grupo global de balas
        this.bullets = this.physics.add.group();
        const onBulletCollision = (bullet, collider) => {
            bullet.createSpark(bullet.x, bullet.y);
            bullet.destroy();
        };
        this.physics.add.collider(this.bullets, layerWall, onBulletCollision);
        this.physics.add.collider(this.bullets, this.butanoColliders, onBulletCollision);

        // Crear la animación de la chispa (si no existe)
        if (!this.anims.exists('spark')) {
            this.anims.create({
                key: 'spark',
                frames: this.anims.generateFrameNumbers('explode', { start: 0, end: 7 }),
                frameRate: 20,
                repeat: 0
            });
        }

        this.scene.launch('')

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

}