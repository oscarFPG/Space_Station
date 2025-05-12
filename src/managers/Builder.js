
export default class Builder {

    // Escenas
    static ESCENA_BOOT = 'boot'
    static ESCENA_AJUSTES = 'ajustes'
    static ESCENA_VOLUMEN = 'volumen'
    static ESCENA_TUTORIAL = 'tutorial'
    static ESCENA_TIENDA = 'store'
    static ESCENA_NIVEL1 = 'nivel1'
    static ESCENA_NIVEL2 = 'nivel2'
    static ESCENA_NIVEL3 = 'nivel3'
    static ESCENA_NIVEL4 = 'nivel4'
    static ESCENA_NIVEL5_1 = 'nivel5_1'
    static ESCENA_NIVEL5_2 = 'nivel5_2'
    static ESCENA_LOBBY = 'lobby'

    // Animaciones del personaje principal
    static IDLE_ANIMATION = 'playerIdle'
    static RUNNING_ANIMATION = 'playerRunning'

    // Animaciones de enemigos 
    static BASE_ENEMY_TEXTURE = 'enemyIdle'
    static ENEMY2_TEXTURE = '2enemyIdle'
    static FINAL_BOSS_TEXTURE = 'bossIdle'
    static BASE_TURRET_TEXTURE = 'turretBase'

    // Animacion del vendedor
    static SELLER_IDLE_ANIMATION = 'sellerIdle'
   
    // Armas
    static WEAPON_OLD_COLT = 'weaponOldColt'
    static WEAPON_PISTOLA_BASE = 'weapon1'
    static WEAPON_MACHINE_GUN = 'weapon2'
    static WEAPON_SNIPER = 'weapon3'
    static ENEMY_WEAPON_PISTOLA_BASE = 'weapon1Enemy'
    static ENEMY_WEAPON_MACHINE_GUN = 'weapon2Enemy'
    static FINAL_WEAPON = 'weapon4'
    static WEAPON_TURRET = 'weaponTurret'
    static WEAPON_SLOWED_TURRET = 'weaponSlowedTurret'
    static EXPLODE = 'explode'
   

    // Proyectiles
    static AMMO_BASE = 'municionBase'
    static AMMO_BASE_MACHINE_GUN = 'municionEnemigoAmetralladora'
    static AMMO_SNIPER = 'municionSniper'
    static AMMO_ENEMY_BASE = 'municionEnemigoBase'
    static AMMO_ENEMY_MACHINE_GUN = 'municionEnemigoAmetralladora'
    static AMMO_TURRET = 'municionTorreta'

    // Objetos
    static OBJ_VIDA = 'objVida'
    static OBJ_MONEDA = 'objMoneda'
    static OBJ_ESCUDO = 'objEscudo'
    static OBJ_BATERIA = 'objBateria'
    static OBJ_NOTA = 'objNota'
    static OBJ_CAJA = 'objCaja'
    static OBJ_CAJA2 = 'objCaja2'
    static OBJ_AMMO_BOX_BASE = 'objAmmoBoxBase'
    static OBJ_AMMO_BOX_MACHINE_GUN = 'objAmmoBoxMachineGun'
    static OBJ_AMMO_BOX_SNIPER = 'objAmmoBoxSniper'
    static OBJ_LASER_VERTICAL = 'objLaserVertical'
    static OBJ_LASER_HORIZONTAL = 'objLaserHorizontal'
    static OBJ_TERMINAL = 'terminal'
    static OBJ_BATTERY_LOW = 'batteryStructLow'
    static OBJ_BATTERY_FULL = 'batteryStructFull' //'batteryStructLFull'
    static OBJ_DOOR = 'door'
    static OBJ_CONSOLE_BLOCK ='consoleBlocked'
    static OBJ_BOX_ANIMATION = 'boxAnimation'
    static OBJ_DOORS_ANIMATION = 'doorsAnimation'

    // Interfaces
    static UI_PLAYER_UI = 'playerUI'
    static UI_COIN_ICON = 'coinIcon'
    static UI_BATTERY_ICON = 'batteryIcon'

    // Imagenes
    static IMG_FONDO_FRONT_PAGE = 'front-page'
    static IMG_FONDO_STORE_PAGE = 'store-page'
    
    //MAPs
    static MAP = 'map'
    static MAP_LOBBY = 'map_lobby'
    static MAP_TUTORIAL = 'map_tutorial'
    static MAP_LEVEL_1 = 'map_level_1'
    static MAP_LEVEL_2 = 'map_level_2'
    static MAP_LEVEL_3 = 'map_level_3'
    static MAP_LEVEL_4 = 'map_level_4'
    static MAP_LEVEL_5_1 = 'map_level_5_1'
    static MAP_LEVEL_5_2 = 'map_level_5_2'


    
    //Tiles
    static TILES = 'tiles'

    // Musica
    static MUSIC_FONDO = 'ambiente'
    static MUSIC_MENU_MUSIC = 'mainMenuMusic'

    // Efectos de sonido
    static SFX_EXPLOSION = ''
    static SOUND_CLICK = 'ClickSOund'
    static SOUND_GUN = 'gun_sound'
    static SOUND_CONSOLE = 'console_sound'
    static SOUND_BOX_BREAKING = 'box_breaking'
    static SOUND_PICK_HEALT = 'pick_up_health'
    static SOUND_PICK_GUN = 'pick_up_gun'
    static SOUND_PICK_AMMO = 'pick_up_ammo'
    static SOUND_PICK_COIN = 'pick_up_coin'
    static SOUND_PICK_BATTERY = 'pick_up_battery'
    static SOUND_RELOADING = 'reloading_gun'
    static SOUND_DOOR_OPEN = 'doors_open'
    static SOUND_DOOR_CLOSED = 'doors_closed'
    static SOUND_DEAD_PLAYER = 'player_dead'
    static SOUND_SHOT_IMPACT = 'impact_shot'
    static SOUND_ACTIVETE_NOTE = 'activate_note'
    static SOUND_FINAL_BOSS = 'final boss'
    static SOUND_FINAL_GAME = 'final game'
    static SOUND_FAIL = 'error'
    static SOUND_SUCCESS = 'success'

    constructor(){
        throw new Error('La clase \'Builder\' no se puede y no se debe instanciar')
    }
}