import Phaser from 'phaser'
import BaseScene from './base-scene.js'
import Note from '../base-game-objects/Note.js';
import Console from '../base-game-objects/Console.js';
import Laser from '../base-game-objects/Laser.js';

import CoinItem from '../base-game-objects/CoinItem.js';
import HealthItem from '../base-game-objects/HealthItem.js';
import ShieldItem from '../base-game-objects/ShieldItem.js';


export default class Tutorial extends BaseScene {

    constructor(){
        Tutorial.KEY = 'tutorial'
        super(Tutorial.KEY)
    }

    create(){

        var map = this.make.tilemap({ key: 'map', tileWidth: 111, tileHeight: 111 })
        var tileset = map.addTilesetImage('tilemap', 'tiles')

        super.create(map, tileset)
        this.createMushroom(map)
    }

    createMushroom(map) { 

        this.notes = map.createFromObjects('objects', { gid: 11, classType: Note, key: 'note' });
        this.lasers = map.createFromObjects('objects', { gid: 40, classType: Laser, key: 'laser2' });
        this.healthItems = map.createFromObjects('objects', { gid: 20, classType: HealthItem, key: 'health' });
        this.shieldItems = map.createFromObjects('objects', { gid: 21, classType: ShieldItem, key: 'shield' });
        this.coinItems = map.createFromObjects('objects', { gid: 19, classType: CoinItem, key: 'coin' });
        this.consolesOff = map.createFromObjects('objects', { gid: 42, classType: Console, key: 'consoleBlocked' });

        this.notes.forEach(note => {
            note.configure(this._player);
        });
        this.healthItems.forEach(healthItem => {
            healthItem.configure(this._player);
        });
        this.shieldItems.forEach(shieldItem => {
            shieldItem.configure(this._player);
        });
        this.coinItems.forEach(coinItem => {
            coinItem.configure(this._player);
        });
        this.consolesOff.forEach(console => {
            console.configure(this._player, this.lasers);
        });
        this.lasers.forEach(laser => {
            this.physics.add.overlap(this._player, laser, this.onLaserHit, null, this);
        });
        
    }

    onLaserHit(player, laser) {
        player.receiveDamage(200);
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
        this.coinItems.forEach(coinItem => {
            coinItem.update();
        });
        this.consolesOff.forEach(console => {
            console.update();
        });
    }
}