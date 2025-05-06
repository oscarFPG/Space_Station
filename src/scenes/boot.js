import Phaser from 'phaser'
import Builder from '../managers/Builder.js'

//Personaje Principal
import Player from '../game-objects/characters/Player.js'

// Escenas
import BaseScene from './BaseScene.js'

// Animaciones
import CharacterIdle from '../../assets/sprites/idle_player_new.png'
import CharacterRunning from '../../assets/sprites/running_new.png'
import EnemyIdle from '../../assets/sprites/idle_enemy_new.png'
import SellerIdle from '../../assets/sprites/idle_ia_seller.png'
import TwoEnemyIdle from '../../assets/sprites/idle_2enemy_new.png'
import BossIdle from '../../assets/sprites/idle_boss_enemy.png'
import boxBroken from '../../assets/objects/box_broken.png'
import doorsOpen from '../../assets/objects/doors_open.png'

// Armas
import OLD_COLT from '../../assets/weapons/OldColt.png'
import ENEMY_WEAPON from '../../assets/weapons/weapon1_enemy.png'
import ENEMY_2WEAPON from '../../assets/weapons/weapon2_enemy.png'
import PISTOLA_BASE from '../../assets/weapons/weapon1.png'
import MACHINE_GUN from '../../assets/weapons/weapon2.png'
import SNIPER from '../../assets/weapons/weapon3.png'
import FINAL_WEAPON from '../../assets/weapons/weapon4.png'

//Balas
import BASE_BULLET from '../../assets/bullets/bullet1.png'
import BASE_MACHINE_GUN_BULLET from '../../assets/bullets/bullet_machine_gun.png'
import BASE_SNIPER_BULLET from '../../assets/bullets/bullet_sniper.png'
import MACHINE_GUN_BULLET from '../../assets/bullets/bullet_enemy_machine_gun.png'
import BASE_BULLET_ENEMY from '../../assets/bullets/bullet1_enemy.png'
import BULLET_TURRET from '../../assets/bullets/bullet1_turret.png'
import Explode from '../../assets/effects/explode0.png'

// Mapas
import TilemapImage from '../../assets/blocks/Tilemap2.png'
import Map from '../../assets/maps/map1.json'
import LobbyMap from '../../assets/maps/lobby.json'
import TutorialMap from '../../assets/maps/tutorial_mapa.json'
import Level1Map from '../../assets/maps/Level1.json'
import Level2Map from '../../assets/maps/Level2.json'
import Level3Map from '../../assets/maps/Level3.json'
import Level4Map from '../../assets/maps/Level4.json'
import Level5_1Map from '../../assets/maps/Level5_1.json'
import Level5_2Map from '../../assets/maps/Level5_2.json'

// Objetos 
import Note from '../../assets/objects/paper.png'
import CONSOLE from '../../assets/objects/panel_off.png'
import laserUp from '../../assets/objects/laser_2.png'
import laserDown from '../../assets/objects/laser_1.png'
import HEALTH from '../../assets/objects/healthItem.png'
import SHIELD from '../../assets/objects/shieldItem.png'
import COIN from '../../assets/objects/coin.png'
import AMMO_BOX_BASE_PISTOL from '../../assets/objects/basePistolAmmoBox.png'
import AMMO_BOX_MACHINE_GUN from '../../assets/objects/baseMachineGunAmmoBox.png'
import AMMO_BOX_SNIPER from '../../assets/objects/baseSniperAmmoBox.png'
import BATTERY from '../../assets/objects/batteryItem.png'
import BATTERY_STRUCTURE_FULL from '../../assets/objects/full_dispensator.png'
import BATTERY_STRUCTURE_LOW from '../../assets/objects/low_dispensator.png'
import DOOR from '../../assets/objects/door.png'
import BOX from '../../assets/objects/box.png'
import HARD_BOX from '../../assets/objects/box_hard.png'
import TURRET_WEAPON from '../../assets/objects/turret_default_.png'
import TURRET_BASE from '../../assets/objects/turret_base_.png'

// Interfaces
import PlayerHealth from '../../assets/ui/HealthBar.png'
import COIN_ICON from '../../assets/objects/Coin.png'
import BATTERY_ICON from '../../assets/objects/BatteryItem.png'

// Imagenes
import FRONT from '../../assets/images/portada.png'
import STORE from '../../assets/store/example.png'

// Musica
import MAINMENU_MUSIC from '../../audio/music/SpaceStation-Menu.mp3'
import ClickSOund from '../../audio/effects/posibleClickSound.mp3'
import GUN_SOUND from '../../audio/effects/gunSound.mp3'
import IMPACT_BULLET_SOUND from '../../audio/effects/impact_shot.mp3'
import PLAYER_DEAD from '../../audio/effects/Player_dead_sound.mp3'
import CONSOLE_SOUND from '../../audio/effects/consoleSoundmp3.mp3'
import BOX_BREAKING from '../../audio/effects/box_breaking.mp3'
import PICK_UP_HEALTH from '../../audio/effects/pick_up_health.mp3'
import PICK_UP_GUN from '../../audio/effects/pick_up_gun.mp3'
import PICK_UP_BATTERY from '../../audio/effects/pick_up_battery.mp3'
import PICK_UP_AMMO from '../../audio/effects/pick_up_ammo.mp3'
import PICK_UP_COIN from '../../audio/effects/pick_up_coin.mp3'
import DOORS_OPEN from '../../audio/effects/doors_open.mp3'
import DOORS_CLOSED from '../../audio/effects/doors_closed.mp3'
import RELOADING_WEAPON from '../../audio/effects/reloading_weapon.mp3'
import ACTIVATE_NOTE from '../../audio/effects/activate_note.mp3'
import AMBIENTE from '../../audio/music/Escape_station_ambient.mp3'  
import FINAL_BOSS_THEME from '../../audio/music/FinalBossMusic.mp3'  
import FINAL_GAME_THEME from '../../audio/music/Final_theme_Escape_Station.mp3'  
import ERROR from  '../../audio/effects/error1.mp3'
import SUCCESS from '../../audio/effects/acierto.mp3'



export default class Boot extends BaseScene {
    static PLAYER_VIDA_INICIAL = 20
	static PLAYER_ESCUDO_INICIAL = 15
	static PLAYER_DINERO_INICIAL = 0
	static PLAYER_BATERIA_INICIAL = 0
	static PLAYER_SPEED = 200

    constructor(){
        super('boot')
    }

    preload(){

        // Armas
        this.load.image(Builder.WEAPON_OLD_COLT, OLD_COLT)
        this.load.image(Builder.ENEMY_WEAPON_PISTOLA_BASE, ENEMY_WEAPON)
        this.load.image(Builder.ENEMY_WEAPON_MACHINE_GUN, ENEMY_2WEAPON)
        this.load.image(Builder.WEAPON_PISTOLA_BASE, PISTOLA_BASE)
        this.load.image(Builder.WEAPON_MACHINE_GUN, MACHINE_GUN)
        this.load.image(Builder.WEAPON_SNIPER, SNIPER)
        this.load.image(Builder.FINAL_WEAPON, FINAL_WEAPON)
        this.load.image(Builder.WEAPON_TURRET, TURRET_WEAPON)
        this.load.image(Builder.WEAPON_SLOWED_TURRET, TURRET_WEAPON)

        // Proyectiles
        this.load.image(Builder.AMMO_BASE, BASE_BULLET)
        this.load.image(Builder.AMMO_BASE_MACHINE_GUN, BASE_MACHINE_GUN_BULLET)
        this.load.image(Builder.AMMO_SNIPER, BASE_SNIPER_BULLET)
        this.load.image(Builder.AMMO_ENEMY_BASE, BASE_BULLET_ENEMY)
        this.load.image(Builder.AMMO_ENEMY_MACHINE_GUN, MACHINE_GUN_BULLET)
        this.load.image(Builder.AMMO_TURRET, BULLET_TURRET)

        // Objetos
        this.load.image(Builder.OBJ_VIDA, HEALTH)
        this.load.image(Builder.OBJ_ESCUDO, SHIELD)
        this.load.image(Builder.OBJ_MONEDA, COIN)
        this.load.image(Builder.OBJ_AMMO_BOX_BASE, AMMO_BOX_BASE_PISTOL)
        this.load.image(Builder.OBJ_AMMO_BOX_MACHINE_GUN, AMMO_BOX_MACHINE_GUN)
        this.load.image(Builder.OBJ_AMMO_BOX_SNIPER, AMMO_BOX_SNIPER)
        this.load.image(Builder.OBJ_BATERIA, BATTERY)
        this.load.image(Builder.OBJ_NOTA, Note)
        this.load.image(Builder.OBJ_LASER_VERTICAL, laserUp)
        this.load.image(Builder.OBJ_LASER_HORIZONTAL, laserDown)
        this.load.image(Builder.OBJ_CAJA, BOX)
        this.load.image(Builder.OBJ_CAJA2, HARD_BOX)

        // Resto (Por clasificar) - TODO
        this.load.image('batteryStructLow', BATTERY_STRUCTURE_LOW)
        this.load.image('batteryStructFull', BATTERY_STRUCTURE_FULL)
        this.load.image('door', DOOR)
        this.load.image('consoleBlocked', CONSOLE)
        this.load.image('turretBase', TURRET_BASE)
        
        // Fondos
        this.load.image('front-page', FRONT)
        this.load.image('store-page', STORE)

        // UI
        this.load.image('playerUI', PlayerHealth)
        this.load.image('coinIcon', COIN_ICON)
        this.load.image('batteryIcon', BATTERY_ICON)
        
        // Mapas
        this.load.tilemapTiledJSON('map', Map)
        this.load.tilemapTiledJSON('map_lobby', LobbyMap)
        this.load.tilemapTiledJSON('map_tutorial', TutorialMap)
        this.load.tilemapTiledJSON('map_level_1', Level1Map)
        this.load.tilemapTiledJSON('map_level_2', Level2Map)
        this.load.tilemapTiledJSON('map_level_3', Level3Map)
        this.load.tilemapTiledJSON('map_level_4', Level4Map)
        this.load.tilemapTiledJSON('map_level_5_1', Level5_1Map)
        this.load.tilemapTiledJSON('map_level_5_2', Level5_2Map)
        
        // Tilesets
        this.load.image('tiles', TilemapImage)

        // Spritesheets
        this.load.spritesheet('boxAnimation', boxBroken, { frameWidth: 111 , frameHeight: 111 })
        this.load.spritesheet('doorsAnimation', doorsOpen, { frameWidth: 111 , frameHeight: 111 })
        this.load.spritesheet('playerIdle', CharacterIdle, { frameWidth: 111 , frameHeight: 108 })
        this.load.spritesheet('playerRunning', CharacterRunning, { frameWidth: 111 , frameHeight: 108 })
        this.load.spritesheet('explode', Explode, { frameWidth: 285 , frameHeight: 285 })
        this.load.spritesheet('enemyIdle', EnemyIdle, { frameWidth: 111 , frameHeight: 108 })
        this.load.spritesheet('2enemyIdle', TwoEnemyIdle, { frameWidth: 111 , frameHeight: 108 })
        this.load.spritesheet('bossIdle', BossIdle, { frameWidth: 155 , frameHeight: 151 })
        this.load.spritesheet('sellerIdle', SellerIdle, { frameWidth: 111 , frameHeight: 108 })

        // Audio
        this.load.audio('mainMenuMusic', MAINMENU_MUSIC)
        this.load.audio('ClickSOund', ClickSOund)
        this.load.audio('gun_sound',GUN_SOUND)
        this.load.audio('console_sound', CONSOLE_SOUND)
        this.load.audio('box_breaking', BOX_BREAKING)

        this.load.audio('pick_up_health', PICK_UP_HEALTH)
        this.load.audio('pick_up_gun', PICK_UP_GUN)
        this.load.audio('pick_up_ammo', PICK_UP_AMMO)
        this.load.audio('pick_up_coin', PICK_UP_COIN)
        this.load.audio('pick_up_battery', PICK_UP_BATTERY)
        this.load.audio('reloading_gun', RELOADING_WEAPON)

        this.load.audio('doors_open', DOORS_OPEN)
        this.load.audio('doors_closed', DOORS_CLOSED)
        

        this.load.audio('ambiente', AMBIENTE)
        this.load.audio('player_dead', PLAYER_DEAD)
        this.load.audio('impact_shot', IMPACT_BULLET_SOUND)
        this.load.audio('activate_note', ACTIVATE_NOTE)
        this.load.audio('final boss', FINAL_BOSS_THEME)
        this.load.audio('final game', FINAL_GAME_THEME)
        this.load.audio('error',ERROR)
        this.load.audio('success',SUCCESS)
    }
    
    create(){
        
        // Background image
        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'front-page').setOrigin(0.5);
        this._nextScene = 'tutorial'
        this._previousScene = 'boot'
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
            const status = {
                health:  Boot.PLAYER_VIDA_INICIAL,
                shield: Boot.PLAYER_ESCUDO_INICIAL,
                money: Boot.PLAYER_DINERO_INICIAL,
                weapon1: null,
                weapon2: null,
                previousScene: this._previousScene
              };
            this.scene.switch(this._nextScene, status)
        }   
    }
}