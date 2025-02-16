import CharacterIdle from '../../assets/sprites/idle.png'
import CharacterRunning from '../../assets/sprites/running.png'
import TilemapImage from '../../assets/blocks/Tilemap.png'
import Map from '../../assets/maps/map1.json'
import Player from '../game-objects/Player'
import Phaser from 'phaser'


export default class Tutorial extends Phaser.Scene {

    constructor(){
        super({ key: 'tutorial' })
    }

    preload(){
        this.load.image("tiles", TilemapImage)
        this.load.image('character-running', CharacterRunning);
        this.load.tilemapTiledJSON("map", Map);
        this.load.spritesheet('playerIdle', CharacterIdle, {frameWidth: 185 , frameHeight: 180});
        this.load.spritesheet('playerRunning', CharacterRunning, {frameWidth: 185 , frameHeight: 180});
    }

    create(){
        //this.add.text(400, 400, "Escena del tutorial");
        var map = this.make.tilemap({key: "map", tileWidth: 185, tileHeight: 185});
        var tileset = map.addTilesetImage("Tilemap", "tiles");   
        var layer = map.createLayer("topLayer", tileset, 0, 0);
        const player = new Player(this, 200, 200, 'playerIdle', 'playerRunning');

           // Asegurar que el jugador no salga de los límites del mundo
           // Ajustar los límites del mundo al tamaño del mapa
        this.physics.add.collider(player, layer);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        player.setCollideWorldBounds(true);
        // Ajustar límites de la cámara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        // Hacer que la cámara siga al jugador
        this.cameras.main.startFollow(player);
        this.cameras.main.setZoom(0.6);
    }
    update(){

    }
}