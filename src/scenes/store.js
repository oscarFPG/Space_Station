import Phaser from 'phaser'
import BaseScene from './BaseScene.js'

export default class Store {

    static NUM_TEXTOS = 3
    static NUM_CARACTERS = 10
    
    constructor(){
        super('store');
    }
    
    create(){
        
        // Background image
        this.add.image(800, 1000, 'store-page')
        
        // Footer text
        this.add.text(300, 600, 'Press ESC to go back to the game...', {
            fontSize: 20,
            backgroundColor: '#000',
            stroke: '#0ff',
            strokeThickness: 1.2
        });

        // Parameters
        this.k = 0
        this.textos[NUM_TEXTOS]
        this.i = 0
        this.texto_0[NUM_CARACTERS]
        this.read = false

        while(k < NUM_TEXTOS) {
            this.textos[k] =  this.texto_0
            k += 1

            let objeto = this.add.sprite(100 + i * 50, 100, 'nombreDelSprite');
            textos.push(objeto)
        }
        this.k = 0

        // Custom event for ENTER key
        this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.b = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
        this.c = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.e = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.f = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.g = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        this.h = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        this.i = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        this.j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.k = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        this.l = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
        this.m = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.n = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.o = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.p = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.t = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.u = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
        this.v = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
        this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.y = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
        this.z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        this.up_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.down_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.delete_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DELETE);
        this.enter_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.esc_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    read_Keyboard_event(){
        if(Phaser.Input.Keyboard.JustDown(this.up_key)) {
            if(k != NUM_TEXTOS - 1)
                k += 1
            else
                k = 0
        }
        else if(Phaser.Input.Keyboard.JustDown(this.down_key)) {
            if(k != 0)
                k -= 1
            else
                k = NUM_TEXTOS
        }
        else if(Phaser.Input.Keyboard.JustDown(this.delete_key)) {
            if(i != 0)
                i -= 1
        }
        else if(Phaser.Input.Keyboard.JustDown(this.enter_key)) {
            this.read = true
        }
        else if(Phaser.Input.Keyboard.JustDown(this.a)) {
            
            this.i += 1
        }
        



    }


    update() {
        this.read = false
        // Cambiar escena tutorial
        if(Phaser.Input.Keyboard.JustDown(this.esc_key)){
            this.scene.switch('tutorial', 'store');
        }
        this.read_Keyboard_event();

        // Pedir confirmacion para compra (Cambiar escena)
       

        //Salir de la Tienda
    }

}