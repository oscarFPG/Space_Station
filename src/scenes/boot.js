import Phaser from 'phaser'

// Animaciones
import CharacterIdle from '../../assets/sprites/idle_new.png'
import CharacterRunning from '../../assets/sprites/running_new.png'
import EnemyIdle from '../../assets/sprites/idle_enemy_new.png'

// Armas / Objetos
import OldColt from '../../assets/weapons/OldColt.png'
import Weapon1 from '../../assets/weapons/weapon1.png'
import Weapon2 from '../../assets/weapons/weapon2.png'
import Weapon3 from '../../assets/weapons/weapon3.png'
import Weapon4 from '../../assets/weapons/weapon4.png'
import Bullet1 from '../../assets/bullets/bullet1.png'
import Explode from '../../assets/effects/explode.png'

// Mapas
import TilemapImage from '../../assets/blocks/tilemap.png'
import Map from '../../assets/maps/map1.json'

//Objetos 
import Paper from '../../assets/blocks/paper.png'
import ConsoleBlocked from '../../assets/blocks/panel_off.png'
import laserUp from '../../assets/blocks/laser_2.png'
import laserDown from '../../assets/blocks/laser_1.png'

// Interfaces
import PlayerHealth from '../../assets/ui/HealthBar.png'

// Imagenes
import FRONT from '../../assets/images/portada.png'
import STORE from '../../assets/store/example.png'

// Musica
import MAINMENU_MUSIC from '../../audio/music/SpaceStation-Menu.mp3'


export default class Boot extends Phaser.Scene {

    constructor(){
        super({ key: 'boot' });
    }

    preload(){

        // Imagenes
        this.load.image('tiles', TilemapImage);
        this.load.image('baseWeapon', OldColt);
        this.load.image('note', Paper);
        this.load.image('laser2', laserUp);
        this.load.image('laser1', laserDown);
        this.load.image('consoleBlocked', ConsoleBlocked);
        this.load.image('weapon1', Weapon1);
        this.load.image('weapon2', Weapon2);
        this.load.image('weapon3', Weapon3);
        this.load.image('weapon4', Weapon4);
        this.load.image('bullet1', Bullet1);
        this.load.image('playerUI', PlayerHealth);
        this.load.image('front-page', FRONT);
        this.load.image('store-page', STORE);
        
        // Mapas
        this.load.tilemapTiledJSON('map', Map);

        // Spritesheets
        this.load.spritesheet('playerIdle', CharacterIdle, { frameWidth: 111 , frameHeight: 108 });
        this.load.spritesheet('playerRunning', CharacterRunning, { frameWidth: 111 , frameHeight: 108 });
        this.load.spritesheet('explode', Explode, { frameWidth: 285 , frameHeight: 285 });
        this.load.spritesheet('enemyIdle', EnemyIdle, { frameWidth: 111 , frameHeight: 108 });

        // Audio
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