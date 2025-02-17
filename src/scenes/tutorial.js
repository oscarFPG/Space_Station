import CharacterIdle from '../../assets/sprites/idle.png'
import CharacterRunning from '../../assets/sprites/running.png'
import Weapon1 from '../../assets/weapons/weapon1.png'
import Weapon2 from '../../assets/weapons/weapon2.png'
import Weapon3 from '../../assets/weapons/weapon3.png'
import Weapon4 from '../../assets/weapons/weapon4.png'
import TilemapImage from '../../assets/blocks/Tilemap.png'
import Map from '../../assets/maps/map1.json'
import Player from '../game-objects/Player'
import Phaser from 'phaser'


export default class Tutorial extends Phaser.Scene {

    constructor(){
        super({ key: 'tutorial' })
    }

    preload(){
<<<<<<< HEAD
        this.load.image("tiles", TilemapImage)
        this.load.image("weapon1", Weapon1);
        this.load.image("weapon2", Weapon2);
        this.load.image("weapon3", Weapon3);
        this.load.image("weapon4", Weapon4);
        this.load.tilemapTiledJSON("map", Map);
=======

        // Map resources
        this.load.image('tiles', TilemapImage)
        this.load.tilemapTiledJSON('map', Map);

        // Player resources
>>>>>>> f8d2af04f975159df2641c8e3d44d692e7e52795
        this.load.spritesheet('playerIdle', CharacterIdle, {frameWidth: 185 , frameHeight: 180});
        this.load.spritesheet('playerRunning', CharacterRunning, {frameWidth: 185 , frameHeight: 180});
        this.load.image('weapon', WeaponDefault);
    }

    create(){

        //this.add.text(400, 400, "Escena del tutorial");
<<<<<<< HEAD
        var map = this.make.tilemap({key: "map", tileWidth: 185, tileHeight: 185});
        var tileset = map.addTilesetImage("Tilemap", "tiles");   
        var layer = map.createLayer("topLayer", tileset, 0, 0);
        const player = new Player(this, 200, 200, 'playerIdle', 'playerRunning', 3);
=======
        var map = this.make.tilemap({key: 'map', tileWidth: 185, tileHeight: 185});
        var tileset = map.addTilesetImage('Tilemap', 'tiles');   
        var layer = map.createLayer('topLayer', tileset, 0, 0);
        const player = new Player(this, 200, 200);
>>>>>>> f8d2af04f975159df2641c8e3d44d692e7e52795

           // Asegurar que el jugador no salga de los límites del mundo
           // Ajustar los límites del mundo al tamaño del mapa
        this.physics.add.collider(player, layer);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        player.setCollideWorldBounds(true);
        // Ajustar límites de la cámara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        // Hacer que la cámara siga al jugador
        this.cameras.main.startFollow(player);
        this.cameras.main.setZoom(0.45);
    }

    update(){

    }
}