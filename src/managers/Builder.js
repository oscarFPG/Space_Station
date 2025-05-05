
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
    static OBJ_TIENDA = 'objTienda'

    // Interfaces
    static INTERFAZ_PLAYER = ''

    // Imagenes
    static IMG_FONDO = ''

    // Musica
    static MUSIC_FONDO = ''

    // Efectos de sonido
    static SFX_EXPLOSION = ''

    
    constructor(){
        throw new Error('La clase \'Builder\' no se puede y no se debe instanciar')
    }
}