
export default class Builder {

    // Escenas
    static ESCENA_TUTORIAL = 'tutorial'

    // Animaciones
    static ANIM_CAMINAR_PLAYER = ''

    // Armas
    static WEAPON_OLD_COLT = 'weaponOldColt'
    static WEAPON_PISTOLA_BASE = 'weapon1'
    static ENEMY_WEAPON_PISTOLA_BASE = 'weapon1Enemy'
    static WEAPON_2 = 'weapon2'
    static WEAPON_3 = 'weapon3'
    static WEAPON_4 = 'weapon4'
    static WEAPON_TURRENT = 'weaponTurret'

    // Proyectiles
    static AMMO_BASE = 'municionBase'
    static AMMO_ENEMY_BASE = 'municionEnemigoBase'
    static AMMO_TURRET = 'municionTorreta'

    // Mapas
    static MAPA_PRIMER_NIVEL_1 = ''

    // Objetos
    static OBJ_VIDA = 'objVida'
    static OBJ_ESCUDO = 'objEscudo'
    static OBJ_BATERIA = 'objBateria'
    static OBJ_NOTA = 'objNota'
    static OBJ_LASER_VERTICAL = 'objLaserVertical'
    static OBJ_LASER_HORIZONTAL = 'objLaserHorizontal'

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