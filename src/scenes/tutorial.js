import Phaser from 'phaser'
import BaseScene from './base-scene.js'

import Note from '../base-game-objects/Note.js';
import Console from '../base-game-objects/Console.js';
import Laser from '../base-game-objects/Laser.js';

export default class Tutorial extends BaseScene {

    constructor(){
        super('tutorial')
    }

    create(){
        super.create()

        //Creacion variable para que no haya clicks mientras estas en consola
        this.consoleActive = false; // Indica que la consola no está abierta al inici

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
        //this.createMushroom(map);
        
    }

    createMushroom(map) { 

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

    update(time, deltaTime){

        if(Phaser.Input.Keyboard.JustDown(this.p_key)){
            this.scene.switch('store', 'tutorial');
        } 
    }

}