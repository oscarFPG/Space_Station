import CharacterIdle from '../../assets/sprites/idle.png'
import CharacterRunning from '../../assets/sprites/running.png'
import Weapon1 from '../../assets/weapons/weapon1.png'
import Weapon2 from '../../assets/weapons/weapon2.png'
import Weapon3 from '../../assets/weapons/weapon3.png'
import Weapon4 from '../../assets/weapons/weapon4.png'
import TilemapImage from '../../assets/blocks/Tilemap.png'
import Map from '../../assets/maps/map1.json'
import Player from '../game-objects/Player.js'
import Enemy from '../base-game-objects/Enemy.js'
import Phaser from 'phaser'


export default class Tutorial extends Phaser.Scene {

    constructor(){
        super({ key: 'tutorial' })
    }

    preload(){
        this.load.image('tiles', TilemapImage)
        this.load.image('weapon1', Weapon1);
        this.load.image('weapon2', Weapon2);
        this.load.image('weapon3', Weapon3);
        this.load.image('weapon4', Weapon4);
        this.load.tilemapTiledJSON('map', Map);
        this.load.spritesheet(Player.IDLE_ANIMATION, CharacterIdle, {frameWidth: 185 , frameHeight: 180});
        this.load.spritesheet(Player.RUNNING_ANIMATION, CharacterRunning, {frameWidth: 185 , frameHeight: 180});
    }

    create(){

        var map = this.make.tilemap({key: 'map', tileWidth: 185, tileHeight: 185});
        var tileset = map.addTilesetImage('Tilemap', 'tiles');   
        var layer = map.createLayer('topLayer', tileset, 0, 0);

        const enemy = new Enemy(this, 200, 200);
        /*const player = new Player(this, 200, 200);

        // Asegurar que el jugador no salga de los límites del mundo
        // Ajustar los límites del mundo al tamaño del mapa
        this.physics.add.collider(player, layer);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        player.setCollideWorldBounds(true);
        // Ajustar límites de la cámara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        // Hacer que la cámara siga al jugador
        this.cameras.main.startFollow(player);
        */
        this.cameras.main.setZoom(0.5);
    }

    update(){

    }

}