import CharacterIdle from '../../assets/sprites/idle.png'
import CharacterRunning from '../../assets/sprites/running.png'
import Weapon1 from '../../assets/weapons/weapon1.png'
import Weapon2 from '../../assets/weapons/weapon2.png'
import Weapon3 from '../../assets/weapons/weapon3.png'
import Weapon4 from '../../assets/weapons/weapon4.png'
import TilemapImage from '../../assets/blocks/Tilemap.png'
import Crosshair from '../../assets/pointer/crosshair.png'
import Map from '../../assets/maps/map1.json'
import Player from '../game-objects/Player.js'
import Phaser from 'phaser'


export default class Tutorial extends Phaser.Scene {

    constructor(){
        super({ key: 'tutorial' })
    }

    preload(){

        // Images
        this.load.image('tiles', TilemapImage)
        this.load.image('weapon1', Weapon1);
        this.load.image('weapon2', Weapon2);
        this.load.image('weapon3', Weapon3);
        this.load.image('weapon4', Weapon4);
        this.load.image('crosshair', Crosshair);

        // JSONS
        this.load.tilemapTiledJSON('map', Map);
        
        // Spritesheets
        this.load.spritesheet('playerIdle', CharacterIdle, {frameWidth: 185 , frameHeight: 180});
        this.load.spritesheet('playerRunning', CharacterRunning, {frameWidth: 185 , frameHeight: 180});
    }

    create(){

        var map = this.make.tilemap({key: 'map', tileWidth: 185, tileHeight: 185});
        var tileset = map.addTilesetImage('Tilemap', 'tiles');   
        var layer = map.createLayer('topLayer', tileset, 0, 0);
        const player = new Player(this, 200, 200);

        // Asegurar que el jugador no salga de los límites del mundo
        // Ajustar los límites del mundo al tamaño del mapa
        this.physics.add.collider(player, layer);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        player.body.setCollideWorldBounds(true);

        // Ajustar límites de la cámara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        // Hacer que la cámara siga al jugador
        this.cameras.main.startFollow(player);
        this.cameras.main.setZoom(0.5);
        
        // Crear puntero de jugador
        this._crosshair = this.add.sprite(0, 0, Crosshair);
        this._crosshair.setVisible(false);


        /* Configuracion puntero:
            - Visible solo cuando el jugador hace click
            - Invisible cuando el jugador pulsa Escape
            - Cuando es visible: mouse locked y mover el sprite 'crosshair' segun el input del raton
        */
        this.input.on('pointerdown', function (pointer)
        {
            this.input.mouse.requestPointerLock();
            this._crosshair.x = pointer.x;
            this._crosshair.y = pointer.y;  
            this._crosshair.setPosition(pointer.x, pointer.y);
            this._crosshair.setVisible(true);
        }, this);

        this.input.on('pointermove', function(pointer)
        {   
            if(this.input.mouse.locked){
                this._crosshair.x += pointer.movementX;
                this._crosshair.y += pointer.movementY;
            }
        }, this);

        this.input.on.();
        

        //Temporal!!!
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