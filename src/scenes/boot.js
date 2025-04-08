import Phaser from 'phaser'

// Escenas
import BaseScene from './BaseScene.js'

// Animaciones
import CharacterIdle from '../../assets/sprites/idle_player_new.png'
import CharacterRunning from '../../assets/sprites/running_new.png'
import EnemyIdle from '../../assets/sprites/idle_enemy_new.png'

import boxBroken from '../../assets/objects/box_broken.png'
import doorsOpen from '../../assets/objects/doors_open.png'

// Armas / Objetos
import OldColt from '../../assets/weapons/OldColt.png'
import Weapon1 from '../../assets/weapons/weapon1.png'
import Weapon2 from '../../assets/weapons/weapon2.png'
import Weapon3 from '../../assets/weapons/weapon3.png'
import Weapon4 from '../../assets/weapons/weapon4.png'
import Bullet1 from '../../assets/bullets/bullet1.png'
import Explode from '../../assets/effects/explode.png'

// Mapas
import TilemapImage from '../../assets/blocks/Tilemap2.png'
import Map from '../../assets/maps/map1.json'
import TutorialMap from '../../assets/maps/tutorial_mapa.json'
import Level1Map from '../../assets/maps/Level1.json'
import Level2Map from '../../assets/maps/Level2.json'

// Objetos 
import Note from '../../assets/objects/paper.png'
import ConsoleBlocked from '../../assets/objects/panel_off.png'
import laserUp from '../../assets/objects/laser_2.png'
import laserDown from '../../assets/objects/laser_1.png'
import healthItem from '../../assets/objects/healthItem.png'
import shieldItem from '../../assets/objects/shieldItem.png'
import batteryItem from '../../assets/objects/batteryItem.png'
import BATTERY_STRUCTURE_FULL from '../../assets/objects/full_dispensator.png'
import BATTERY_STRUCTURE_LOW from '../../assets/objects/low_dispensator.png'
import doors from '../../assets/objects/door.png'
import box from '../../assets/objects/box.png'


// Interfaces
import PlayerHealth from '../../assets/ui/HealthBar.png'
import COIN_ICON from '../../assets/objects/Coin.png'

// Imagenes
import FRONT from '../../assets/images/portada.png'
import STORE from '../../assets/store/example.png'

// Musica
import MAINMENU_MUSIC from '../../audio/music/SpaceStation-Menu.mp3'
import ClickSOund from '../../audio/effects/posibleClickSound.mp3'
import GUN_SOUND from '../../audio/effects/gunSound.mp3'
import CONSOLE_SOUND from '../../audio/effects/consoleSoundmp3.mp3'
import AMBIENTE from '../../audio/music/ambiente.mp3'  
import ERROR from  '../../audio/effects/error1.mp3'
import SUCCESS from '../../audio/effects/acierto.mp3'


export default class Boot extends BaseScene {

    constructor(){
        super('boot');
    }

    preload(){

        // Imagenes
        this.load.image('health', healthItem);
        this.load.image('shield', shieldItem);
        this.load.image('battery', batteryItem);
        this.load.image('batteryStructLow', BATTERY_STRUCTURE_LOW);
        this.load.image('batteryStructFull', BATTERY_STRUCTURE_FULL);
        this.load.image('door', doors);
        this.load.image('box', box);
        this.load.image('baseWeapon', OldColt)
        this.load.image('note', Note)
        this.load.image('laser2', laserUp)
        this.load.image('laser1', laserDown)
        this.load.image('consoleBlocked', ConsoleBlocked)
        this.load.image('weapon1', Weapon1)
        this.load.image('weapon2', Weapon2)
        this.load.image('weapon3', Weapon3)
        this.load.image('weapon4', Weapon4)
        this.load.image('bullet1', Bullet1)
        this.load.image('front-page', FRONT)
        this.load.image('store-page', STORE)

        // UI
        this.load.image('playerUI', PlayerHealth)
        this.load.image('coinIcon', COIN_ICON)
        
        // Mapas
        this.load.tilemapTiledJSON('map', Map);
        this.load.tilemapTiledJSON('map_tutorial', TutorialMap);
        this.load.tilemapTiledJSON('map_level_1', Level1Map);
        this.load.tilemapTiledJSON('map_level_2', Level2Map);
        
        // Tilesets
        this.load.image('tiles', TilemapImage)

        // Spritesheets
        this.load.spritesheet('boxAnimation', boxBroken, { frameWidth: 111 , frameHeight: 111 });
        this.load.spritesheet('doorsAnimation', doorsOpen, { frameWidth: 111 , frameHeight: 111 });
        this.load.spritesheet('playerIdle', CharacterIdle, { frameWidth: 111 , frameHeight: 108 });
        this.load.spritesheet('playerRunning', CharacterRunning, { frameWidth: 111 , frameHeight: 108 });
        this.load.spritesheet('explode', Explode, { frameWidth: 285 , frameHeight: 285 });
        this.load.spritesheet('enemyIdle', EnemyIdle, { frameWidth: 111 , frameHeight: 108 });

        // Audio
        this.load.audio('mainMenuMusic', MAINMENU_MUSIC)
        this.load.audio('ClickSOund', ClickSOund)
        this.load.audio('gun_sound',GUN_SOUND)
        this.load.audio('console_sound', CONSOLE_SOUND)
        this.load.audio('ambiente', AMBIENTE)
        this.load.audio('error',ERROR)
        this.load.audio('success',SUCCESS)
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