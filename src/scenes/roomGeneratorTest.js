import InitialRoom from '../mapGenerator/initialRoom.js';
import CommonRoom from '../mapGenerator/room.js'
import ShopRoom from '../mapGenerator/shopRoom.js';
import Phaser from 'phaser'

export default class RoomGeneratorScene extends Phaser.Scene {


    // Restricciones del algoritmo
    static MIN_SIZE = 12;
    static MAX_SIZE = 20;
    static NUM_ROOMS = 9;
    static MAX_LEVEL_DIM = 20;


    // Atributos de la clase
    _mapa = [MAX_LEVEL_DIM][MAX_LEVEL_DIM]; // Matriz que representa la colocacion de las salas
    _listaSalas = [];

    constructor(){
        super({ key: 'room-test' })
    }

    preload(){
        console.log('Preloading room generator algorithm');
    }

    create(){
        console.log('Executing room generator algorithm');
        

        this.#generate_initial_room();
        this.#generate_commonRoom();
        this.#generate_shop_room();

        for(let i = 0; i < this._listaSalas.length; i++){
            console.log(this._listaSalas[i]);
        }
    }

    update(){

    }

    #generate_initial_room(){

        let dimensiones = this.#generate_random_rectangle();
        let iniRoom = new InitialRoom(dimensiones.alto, dimensiones.ancho);
        this._listaSalas.push(iniRoom);
    }

    #generate_commonRoom(){

        let dimensiones = this.#generate_random_rectangle();
        let commonRoom = new CommonRoom(dimensiones.alto, dimensiones.ancho);
        this._listaSalas.push(commonRoom);
    }

    #generate_shop_room(){

        let dimensiones = this.#generate_random_rectangle();
        let shopRoom = new ShopRoom(dimensiones.alto, dimensiones.ancho);
        this._listaSalas.push(shopRoom);
    }

    #generate_random_rectangle(){

        return {
            alto: Phaser.Math.Between(RoomGeneratorScene.MIN_SIZE, RoomGeneratorScene.MAX_SIZE),
            ancho: Phaser.Math.Between(RoomGeneratorScene.MIN_SIZE, RoomGeneratorScene.MAX_SIZE)
        }
    }

}