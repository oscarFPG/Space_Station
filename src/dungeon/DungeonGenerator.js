import { RIGHT } from 'phaser';
import Room from './Room.js'

export default class DungeonGenerator {

    static ROOM_TYPES = Object.freeze({
        EMPTY: -1,      // Ningun tipo de sala
        INITIAL: 0,     // Sala en la que aparece el jugador
        COMMON: 1,      // Sala con enemigos
        SHOP: 2,        // Sala con el vendedor
        MINIBOSS: 3,    // Sala con miniboss y/o mas enemigos comunes
        BOSS: 4,        // Sala con el boss final del MUNDO
        FINAL: 5        // Sala con la salida para llegar al siguiente NIVEL
    });

    static DIRECTION = Object.freeze({
        UP: { x: 0, y: -1 },
        DOWN: { x: 0, y: 1 },
        LEFT: { x: -1, y: 0 },
        RIGHT: { x: 1, y: 0 }
    });

    static MIN_ROOM_DIM = 10;
    static MAX_ROOM_DIM = 30;

    constructor(){
        throw new Error('La clase \'DungeonGenerator\' no debe ser instanciada');
    }

    static createDungeon() {
        
        // Cuadricula que representará la colocacion fisica de las salas en el mapa -> Vacia inicialmente
        this._cuadricula = [DungeonGenerator.MAX_ROOM_DIM];
        this._numSalas = 0;
        for(let i = 0; i < DungeonGenerator.MAX_ROOM_DIM; i++){

            this._cuadricula[i] = [DungeonGenerator.MAX_ROOM_DIM];
            for(let j = 0; j < DungeonGenerator.MAX_ROOM_DIM; j++){
                this._cuadricula[i].push(DungeonGenerator.ROOM_TYPES.EMPTY);
            }
        }

        return this._cuadricula;
    }

    static createRoom(type){
        
        if(type === DungeonGenerator.ROOM_TYPES.EMPTY)
            throw new Error('No se puede instanciar una sala vacia');

        var altura = Phaser.Math.Between(DungeonGenerator.MIN_ROOM_DIM, DungeonGenerator.MAX_ROOM_DIM);
        var anchura = Phaser.Math.Between(DungeonGenerator.MIN_ROOM_DIM, DungeonGenerator.MAX_ROOM_DIM);

        this._numSalas++;
        return new Room(altura, anchura, type);
    }


}