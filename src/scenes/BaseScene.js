import Phaser from 'phaser'
import Player from '../game-objects/characters/Player.js'
import Bullet from '../game-objects/base-game-objects/Bullet.js'
import Options from '../options-manager/Options.js'
import BaseGroup from '../game-objects/objects/BaseGroup.js'
import Note from '../game-objects/objects/Note.js'
import Console from '../game-objects/objects/Console.js'
import Laser from '../game-objects/objects/Laser.js'
import HealthItem from '../game-objects/objects/Health.js'
import ShieldItem from '../game-objects/objects/Shield.js'
import BatteryItem from '../game-objects/objects/Battery.js'
import Coin from '../game-objects/objects/Coin.js'
import Box from '../game-objects/objects/Box.js'
import BatteryStructure from '../game-objects/objects/BatteryStructure.js'
import Door from '../game-objects/objects/Door.js'


export default class BaseScene extends Phaser.Scene {

    static LAYER_SUELO = 'floor'
    static LAYER_PARED = 'wall'
    static LAYER_OBJETO = 'extra'

    _previousScene = null
    _nextScene = null

    constructor(sceneKey){
        super({ key: sceneKey })
        this._previousScene = 'settings'
    }

    // IMPORTANTE - cualquier escena que herede de esta clase debe invocar 
    // SIEMPRE esta funcion con super.create()
    create(map, tileset, nextScene){

        if(map == null || tileset == null)
            return

        // Escena siguiente
        this._nextScene = nextScene

        // Capas de todos los niveles
        this._layerSuelo = map.createLayer(BaseScene.LAYER_SUELO, tileset, 0, 0)
        this._layerPared = map.createLayer(BaseScene.LAYER_PARED, tileset, 0, 0)
        this._layerObjeto = map.createLayer(BaseScene.LAYER_OBJETO, tileset, 0, 0)

        // Crear objetos
        this.crear_objetos(map)

        // Crear clase de ajustes
        this._options = Options.get_instance()

        // Musica y efectos
        this.config_musica()
        this.config_efectos_sonido()

        // Limites del mapa
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        // Configuraciones generales
        this.config_iluminacion([this._layerSuelo, this._layerPared, this._layerObjeto])
    
        // Configuracion de eventos
        this.config_eventos()
        
        // Crear la animación de la chispa (si no existe)
        if (!this.anims.exists('spark')) {
            this.anims.create({
                key: 'spark',
                frames: this.anims.generateFrameNumbers('explode', { start: 0, end: 7 }),
                frameRate: 30,
                repeat: 0
            })
        }

        this.scene.launch('')
    }

    update(time, delta){    

        if (this._finalPosition && this._player) {
            const distance = Phaser.Math.Distance.Between(
                this._player.x, this._player.y,
                this._finalPosition.x, this._finalPosition.y
            )
            if (distance < 100 && this._nextScene) { 
                this.scene.switch(this._nextScene, { player: this._player })
            }
        }
    }
    
    config_eventos(){

        // Evento para abrir el menu de ajustes
        this.input.keyboard.on(Options.TECLA_PAUSA, () => {
            this.scene.switch('settings')
        }, this)

    }

    crear_objetos(map) {

        //Se obtiene el jugador que proviene del Manager
        const objectLayer = map.getObjectLayer('objects')
        objectLayer.objects.forEach(object => {

            if(object.type === 'Text' && object.text) {
                const textContent = object.text.text
                const fontSize = object.text.pixelsize
                const fontFamily = object.text.fontfamily
                const color = object.text.color
                // Crea el objeto de texto en Phaser
                this.add.text(object.x, object.y, textContent, {
                    font: `${fontSize}px ${fontFamily}`,
                    color: color
                })
            }
            else if(object.type === 'EnemyPosition') {
                this._enemigos = this.config_enemigos(object.x, object.y)
            }
            else if(object.type === 'PlayerRespawn') {
                this.playerRespawnPosition = { x: object.x, y: object.y }
                this._player = this.config_jugador(this.playerRespawnPosition.x, this.playerRespawnPosition.y)
            }
            else if(object.type === 'FinalPosition') {
                this._finalPosition = { x: object.x, y: object.y }
            }
            else if(object.type === 'BlueLightPoint') {
                this.lights.addLight(object.x, object.y, 250, 0x8888ff, 0.5)
            }
        })

        //Aqui se crean los textos del mapa que contienen informacion importante
        //y asi mismo los puntos de respawn del personaje principal, de los enemigos y la meta del mapa
        //Insercion del resto de objetos con sus respectivas clases
        var notes = map.createFromObjects('objects', { gid: 11, classType: Note, key: 'note' })
        //var lasers = map.createFromObjects('objects', { gid: 16, classType: Laser, key: 'laser2' })
        //var healthItems = map.createFromObjects('objects', { gid: 20, classType: HealthItem, key: 'health' })
        //var shieldItems = map.createFromObjects('objects', { gid: 21, classType: ShieldItem, key: 'shield' })
        //var batteryItems = map.createFromObjects('objects', { gid: 19, classType: BatteryItem, key: 'battery' })
        //var coinItems = map.createFromObjects('objects', { gid: 22, classType: Coin, key: 'coinIcon' })
        //var consolesOff = map.createFromObjects('objects', { gid: 18, classType: Console, key: 'consoleBlocked' })
        //var batteriesStructures = map.createFromObjects('objects', { gid: 12, classType: BatteryStructure, key: 'batteryStructure' })
        //var doors = map.createFromObjects('objects', { gid: 24, classType: Door, key: 'door' })
        //var boxes = map.createFromObjects('objects', { gid: 23, classType: Box, key: 'box' })

        
        // Configurar el resto de objetos
        this.config_characters()

        // Gestion de colisiones entre objetos de tiled y el player
        let group = new BaseGroup(this, true, true, true, [], this._layerPared)
        group.addElement(this._player)
        this._enemigos.forEach(_enemigo => {
            group.addElement(_enemigo)
        })
        //Se establecen las colisiones entre las cajas y las puertas con los personajes
        /*
        this.boxes.forEach(box => {
            group.addCollision(box)
        })
        this.doors.forEach(door => {
            group.addCollision(door)
        })
        */
    }

    config_jugador(x, y) {
        this._player = new Player(this, x, y)
        this._player.body.setCollideWorldBounds(true)
        this._player.body.setImmovable(true)
        return this._player
    }
    
    config_enemigos(x, y){

        return []
    }

    config_characters() {

        this.config_camara(this._player)
        this.config_cursor()

        // Configurar colisiones
        this._layerPared.setCollisionByExclusion([-1])
        this._layerObjeto.setCollisionByExclusion([-1])

        this.crearColliderConSuelo(this._player)
        this.crearColliderConPared(this._player)

        this._enemigos.forEach(enemigo => {   // Para todos los enemigos de la escena
            this.crearColliderConSuelo(enemigo)
            this.crearColliderConPared(enemigo)
        })
        
        this._butanoColliders = this.physics.add.staticGroup()
        this._layerObjeto.forEachTile(tile => {
            if (tile.index !== -1) {

                const baseX = tile.getCenterX()
                const baseY = tile.getCenterY()
                const offsetX = 4
                const offsetY = -1

                // Crear el collider en la posición ajustada
                const collider = this.physics.add.staticImage(baseX + offsetX, baseY + offsetY, null)
                collider.body.setSize(54, 90)
                collider.setVisible(false)
                this._butanoColliders.add(collider)
            }
        })

        this.physics.add.collider(this._player, this._butanoColliders)
        this._paredColliders = this.physics.add.staticGroup()

        this._layerPared.forEachTile(tile => {
            if (tile.index !== -1) { // Solo creamos colisión en los tiles que existen
                const collider = this.physics.add.staticImage(tile.getCenterX(), tile.getCenterY(), null)
                collider.body.setSize(tile.width, tile.height)
                collider.setVisible(false)
                this._paredColliders.add(collider)
            }
        })
        this._enemigos.forEach(enemigo => {
            this.physics.add.collider(enemigo, this._butanoColliders)
            this.physics.add.collider(enemigo, this._player)
        })
        this.physics.add.collider(this._player, this._enemigos)
        this.physics.add.collider(this._player, this.boxes)
        this.physics.add.collider(this._player, this.doors)

        // Crear el grupo global de balas
        this._grupoBalas = this.physics.add.group()
        const onBulletCollision = (obj1, obj2) => {

            let bullet = obj1 instanceof Bullet ? obj1 : obj2
            let target = bullet === obj1 ? obj2 : obj1
            // Si es un objeto que recibe daño -> Aplicar daño de la bala
            if(target.quitarVida)
                target.quitarVida(bullet._damage)

            if (bullet && typeof bullet.createSpark === 'function') {
                bullet.createSpark(bullet.x, bullet.y)
                bullet.destroy()
            }
        }
        this.physics.add.collider(this._grupoBalas, this._layerPared, onBulletCollision)
        this.physics.add.collider(this._grupoBalas, this._player, onBulletCollision)
        this.physics.add.collider(this._grupoBalas, this._butanoColliders, onBulletCollision)
        this.physics.add.collider(this._grupoBalas, this._paredColliders, onBulletCollision)

        this._enemigos.forEach(enemigo => {
            this.physics.add.collider(this._grupoBalas, enemigo, onBulletCollision)
        })
        /* TODO
        this.boxes.forEach(box => {
            this.physics.add.collider(this._grupoBalas, box, onBulletCollision)
        })
        this.doors.forEach(door => {
            this.physics.add.collider(this._grupoBalas, door, onBulletCollision)
        })
        */
        this._grupoObjectos = this.physics.add.staticGroup()
        this.physics.add.overlap(this._player, this._grupoObjectos)
    }

    config_iluminacion(capas){

        for(let i = 0; i < capas.length; i++)
            capas[i].setPipeline('Light2D')

        this.lights.enable()
        this.lights.setAmbientColor(0x777777)
    }

    config_cursor(){
        this.input.setDefaultCursor('crosshair')
    }

    config_camara(player){
        this.cameras.main.startFollow(player)
    }

    config_musica(){

        //this.ambient = this.sound.add('ambiente')
        //const ambient = this.sound.add('ambiente')
        //this.ambient.setVolume(0.5)
        //this.ambient.play()
    }

    config_efectos_sonido(){

    }

    get_player(){
        return this._player
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