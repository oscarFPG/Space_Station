import Phaser from 'phaser'
import Player from '../game-objects/characters/Player.js'
import Bullet from '../game-objects/base-game-objects/Bullet.js'
import Options from '../options-manager/Options.js'


export default class BaseScene extends Phaser.Scene {

    static LAYER_SUELO = 'floor'
    static LAYER_PARED = 'wall'
    static LAYER_OBJETO = 'extra'
    static LAYER_PERSONAJE = 'butano'

    _previousScene = null

    constructor(sceneKey){
        super({ key: sceneKey })
    }


    // IMPORTANTE - cualquier escena que herede de esta clase debe invocar 
    // SIEMPRE esta funcion con super.create()
    create(map, tileset){

        if(map == null || tileset == null)
            return

        // Capas de todos los niveles
        this._layerSuelo = map.createLayer(BaseScene.LAYER_SUELO, tileset, 0, 0)
        this._layerPared = map.createLayer(BaseScene.LAYER_PARED, tileset, 0, 0)
        this._layerObjeto = map.createLayer(BaseScene.LAYER_OBJETO, tileset, 0, 0)
        this._layerPersonaje = map.createLayer(BaseScene.LAYER_PERSONAJE, tileset, 0, 0)

        // Crear clase de ajustes
        this._options = Options.get_instance()

        // Musica
        //this.ambient = this.sound.add('ambiente')
        //const ambient = this.sound.add('ambiente');
        //this.ambient.setVolume(0.5)
        //this.ambient.play()

        // Limites del mapa
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Crear personajes
        this._player = this.config_jugador(1000, 1000)
        var enemigos = this.config_enemigos()

        // Configuraciones generales
        this.config_iluminacion([this._layerSuelo, this._layerPared, this._layerObjeto])
        this.config_camara(this._player)
        this.config_cursor()

        // Configurar colisiones
        this._layerPared.setCollisionByExclusion([-1])
        this._layerObjeto.setCollisionByExclusion([-1])
        this.crearColliderConSuelo(this._player)
        this.crearColliderConPared(this._player)

        enemigos.forEach(enemigo => {   // Para todos los enemigos de la escena
            this.crearColliderConSuelo(enemigo)
            this.crearColliderConPared(enemigo)
        })
        
        this._butanoColliders = this.physics.add.staticGroup();
        this._layerObjeto.forEachTile(tile => {
            if (tile.index !== -1) {

                const baseX = tile.getCenterX();
                const baseY = tile.getCenterY();
                const offsetX = 4;
                const offsetY = -1;

                // Crear el collider en la posición ajustada
                const collider = this.physics.add.staticImage(baseX + offsetX, baseY + offsetY, null);
                collider.body.setSize(54, 90);
                collider.setVisible(false);
                this._butanoColliders.add(collider);
            }
        });
        this.physics.add.collider(this._player, this._butanoColliders);
        enemigos.forEach(enemigo => {
            this.physics.add.collider(enemigo, this._butanoColliders);
        })

        // Crear el grupo global de balas
        this._grupoBalas = this.physics.add.group();
        const onBulletCollision = (obj1, obj2) => {

            let bullet = obj1 instanceof Bullet ? obj1 : obj2;
            let target = bullet === obj1 ? obj2 : obj1;
            
            // Si es un objeto que recibe daño -> Aplicar daño de la bala
            if(target.quitarVida)
                target.quitarVida(bullet._damage)

            if (bullet && typeof bullet.createSpark === 'function') {
                bullet.createSpark(bullet.x, bullet.y);
                bullet.destroy();
            }
        };
        this.physics.add.collider(this._grupoBalas, this._layerPared, onBulletCollision);
        this.physics.add.collider(this._grupoBalas, this._player, onBulletCollision);
        this.physics.add.collider(this._grupoBalas, this._butanoColliders, onBulletCollision);
        enemigos.forEach(enemigo => {
            this.physics.add.collider(this._grupoBalas, enemigo, onBulletCollision);
        })

        // Grupo global de objetos interactuables TODO
        this._grupoObjectos = this.physics.add.staticGroup()
        this.physics.add.overlap(this._player, this._grupoObjectos)

        // Configuracion de eventos
        this.config_eventos()
        
        // Crear la animación de la chispa (si no existe)
        if (!this.anims.exists('spark')) {
            this.anims.create({
                key: 'spark',
                frames: this.anims.generateFrameNumbers('explode', { start: 0, end: 7 }),
                frameRate: 30,
                repeat: 0
            });
        }

        this.scene.launch('')
    }
    

    config_eventos(){

        // Evento para abrir el menu de ajustes
        this.input.keyboard.on(Options.TECLA_PAUSA, () => {
            this.scene.switch('settings', this.scene.key)
        }, this)
    }

    receiveHealthPlayer(health) {
        this._player.healthBoost(health);
    }

    receiveShieldPlayer(shield) {
        this._player.shieldBoost(shield);
    }

    receiveMoneyPlayer(value) {
        this._player.moneyBoost(value);
    }

    config_jugador(){
        return new Player(this, 0, 0)
    }

    config_enemigos(){
        return null;
    }

    config_iluminacion(capas){

        for(let i = 0; i < capas.length; i++)
            capas[i].setPipeline('Light2D')

        this.lights.enable();
        this.lights.setAmbientColor(0x888888);
    }

    config_cursor(){
        this.input.setDefaultCursor('crosshair')
    }

    config_camara(player){
        this.cameras.main.startFollow(player);
    }

    crearColliderConSuelo(gameobject){
        this.physics.add.collider(gameobject, this._layerSuelo)
    }

    crearColliderConPared(gameobject){
        this.physics.add.collider(gameobject, this._layerPared)
    }

    crearColliderConObjetos(gameobject){
        this.physics.add.collider(gameobject, this._layerObjeto)
    }

}