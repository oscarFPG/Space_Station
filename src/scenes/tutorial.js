import Phaser from 'phaser'
import BaseScene from './base-scene.js'
import Note from '../base-game-objects/Note.js';
import Console from '../base-game-objects/Console.js';
import Laser from '../base-game-objects/Laser.js';


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
        this.consolesOff = map.createFromObjects('objects', { gid: 42, classType: Console, key: 'consoleBlocked' });

        this.notes.forEach(note => {
            note.configure(this._player);
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

        this.consolesOff.forEach(console => {
            console.update();
        });
         
    }

}