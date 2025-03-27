import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import ExtendedEnemy from '../game-objects/characters/ExtendedEnemy.js'
import Note from '../game-objects/objects//Note.js';
import Console from '../game-objects/objects//Console.js';
import Laser from '../game-objects/objects//Laser.js';
import HealthItem from '../game-objects/objects//Health.js';
import ShieldItem from '../game-objects/objects//Shield.js';
import BatteryItem from '../game-objects/objects//Battery.js';
import Coin from '../game-objects/objects/Coin.js'
import Box from '../game-objects/objects//Box.js';
import BatteryStructure from '../game-objects/objects//BatteryStructure.js';
import Door from '../game-objects/objects/Door.js';
import BaseGroup from '../game-objects/objects/BaseGroup.js'

export default class Tutorial extends BaseScene {

    constructor(){
        super('Level1')
    }

    create(){

        var map = this.make.tilemap({ key: 'map_level_1', tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('Tilemap2', 'tiles')
        this._enemigos = []
        
        super.create(map, tileset)
        this.createMushroom(map)
    }

    createMushroom(map) { 

        const objectLayer = map.getObjectLayer('objects');
        //Aqui se crean los textos del mapa que contienen informacion importante
        //y asi mismo los puntos de respawn del personaje principal, de los enemigos y la meta del mapa
        //Insercion del resto de objetos con sus respectivas clases
        this.notes = map.createFromObjects('objects', { gid: 11, classType: Note, key: 'note' });
        this.lasers = map.createFromObjects('objects', { gid: 16, classType: Laser, key: 'laser2' });
        this.healthItems = map.createFromObjects('objects', { gid: 20, classType: HealthItem, key: 'health' });
        this.shieldItems = map.createFromObjects('objects', { gid: 21, classType: ShieldItem, key: 'shield' });
        this.batteryItems = map.createFromObjects('objects', { gid: 19, classType: BatteryItem, key: 'battery' });
        //this.coinItems = map.createFromObjects('objects', { gid: 22, classType: Coin, key: 'coin' });
        this.consolesOff = map.createFromObjects('objects', { gid: 18, classType: Console, key: 'consoleBlocked' });
        this.batteriesStructures = map.createFromObjects('objects', { gid: 12, classType: BatteryStructure, key: 'batteryStructure' });
        this.doors = map.createFromObjects('objects', { gid: 24, classType: Door, key: 'door' });
        this.boxes = map.createFromObjects('objects', { gid: 23, classType: Box, key: 'box' });

        objectLayer.objects.forEach(object => {
            if(object.type === "Text" && object.text) {
                const textContent = object.text.text; 
                const fontSize = object.text.pixelsize;
                const fontFamily = object.text.fontfamily;
                const color = object.text.color;

                // Crea el objeto de texto en Phaser
                this.add.text(object.x, object.y, textContent, {
                font: `${fontSize}px ${fontFamily}`,
                color: color
                });
            }
            else if(object.type === "EnemyPosition") {
                this.config_enemigos(object.x, object.y)
            }
            else if(object.type === "PlayerRespawn") {
                this._player = this.config_jugador(object.x, object.y)
            }
            else if(object.type === "FinalPosition") {
                this._finalPosition = { x: object.x, y: object.y };
            }
        });     
        this.config_characters(this._player, this._enemigos, this.boxes, this.doors)

        // Gestion de colisiones entre objetos de tiled y el player
        let group = new BaseGroup(this, true, true, true, [], this._layerPared);
        group.addElement(this._player);
        this.boxes.forEach(box => {
             group.addCollision(box);
        });
        this.doors.forEach(door => {
            group.addCollision(door);
        });
        //Funciones iniciales de los objetos
        this.notes.forEach(note => {
            note.configure(this._player);
        });
        this.healthItems.forEach(healthItem => {
            healthItem.configure(this._player);
        });
        this.shieldItems.forEach(shieldItem => {
            shieldItem.configure(this._player);
        });
        this.consolesOff.forEach(console => {
            console.configure(this._player, this.lasers);
        });
        this.lasers.forEach(laser => {
            laser.configure(this._player);
        });
        this.batteryItems.forEach(battery => {
            battery.configure(this._player);
        });
        this.batteriesStructures.forEach(batteriesStructure => {
            batteriesStructure.configure(this._player, this.doors);
        });
        this.doors.forEach(door => {
            door.configure(this._player);
        });
    }

    config_enemigos(x, y){
        var unEnemigo = new ExtendedEnemy(this, x, y)
        unEnemigo.body.setCollideWorldBounds(true)
        unEnemigo.body.setImmovable(true)
        this._enemigos.push(unEnemigo)
    }

    update(time, deltaTime){
        this.notes.forEach(note => {
            note.update();
        });
        this.healthItems.forEach(healthItem => {
            healthItem.update();
        });
        this.shieldItems.forEach(shieldItem => {
            shieldItem.update();
        });
        this.batteryItems.forEach(batteryItem => {
            batteryItem.update();
        });
        this.lasers.forEach(laser => {
            laser.update(time, deltaTime);
        });
       // this.coinItems.forEach(coinItem => {
        //    coinItem.update();
        //});
        this.consolesOff.forEach(console => {
            console.update();
        });
        this.doors.forEach(door => {
            door.update();
        });
        this.batteriesStructures.forEach(batteriesStructure => {
            batteriesStructure.update();
        });
        if (this._finalPosition && this._player) {
            const distance = Phaser.Math.Distance.Between(
                this._player.x, this._player.y,
                this._finalPosition.x, this._finalPosition.y
            );
            if (distance < 100) { 
                this.scene.switch('Level1', 'boot')
            }
        }
    }
}