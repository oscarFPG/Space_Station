import Phaser from 'phaser'
import FRONT from '../../assets/images/portada.png'
import MAINMENU_MUSIC from '../../assets/assets/musica/pruba1Space_Station.mp3'

export default class Boot extends Phaser.Scene {

    constructor(){
        super({ key: 'boot' });
    }

    preload(){

        this.load.image('front-page', FRONT);
        this.load.audio('mainMenuMusic', MAINMENU_MUSIC);
    }
    
    create(){
        
        // Background image
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'front-page').setOrigin(0.5);

        // Footer text
        this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 100, 'Press ENTER to start the game...', {
            fontSize: 20,
            backgroundColor: '#000',
            stroke: '#fff',
            strokeThickness: 1.2
        })
        .setOrigin(0.5);

        // Custom event for ENTER key
        this.enter_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Music
        this._mainmenu_music = this.sound.add('mainMenuMusic')
        this._mainmenu_music.setVolume(0.2)
        this._mainmenu_music.play()

        // Pausar musica al pasar de escena
        this.events.on('sleep', (sys) => {
            this._mainmenu_music.pause()
        }, this)
    }

    update(){

        // Cambiar escena
        if(Phaser.Input.Keyboard.JustDown(this.enter_key)){
            this.scene.switch('tutorial', 'boot')
        }   
    }

}