import Phaser from 'phaser'
import Player from '../game-objects/characters/Player.js'
import Bullet from '../game-objects/base-game-objects/Bullet.js'
import Options from '../options-manager/Options.js'
import BaseGroup from '../game-objects/objects/BaseGroup.js'
import Note from '../game-objects/objects/Note.js'
import Console from '../game-objects/objects/Console.js'
import Laser from '../game-objects/objects/Laser.js'
import Health from '../game-objects/objects/Health.js'
import Shield from '../game-objects/objects/Shield.js'
import BatteryItem from '../game-objects/objects/Battery.js'
import Coin from '../game-objects/objects/Coin.js'
import Box from '../game-objects/objects/Box.js'
import BatteryStructure from '../game-objects/objects/BatteryStructure.js'
import Door from '../game-objects/objects/Door.js'
import ExtendedEnemy from '../game-objects/characters/ExtendedEnemy.js'


export default class BaseScene extends Phaser.Scene {

    static LAYER_SUELO = 'floor'
    static LAYER_PARED = 'wall'
    static LAYER_OBJETO = 'objects'

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


        this.listaConsolas = []
        this.listaLaseres = []
        this.listaPuertas = []
        this.listaEstructuraBaterias = []
        this._listaEnemigos = []

        // Capas de todos los niveles
        this._layerSuelo = map.createLayer(BaseScene.LAYER_SUELO, tileset, 0, 0)
        this._layerPared = map.createLayer(BaseScene.LAYER_PARED, tileset, 0, 0)
        this._layerObjeto = map.createLayer(BaseScene.LAYER_OBJETO, tileset, 0, 0)

        // Configurar colisiones
        this._layerPared.setCollisionByExclusion([-1])
        this._layerObjeto.setCollisionByExclusion([-1])

        // Grupo para gestionar colisiones de los personajes
        this._charactersGroup = new BaseGroup(this, true, true, true, [], this._layerPared)
        
        // Escena siguiente
        this._nextScene = nextScene

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
        this.config_camara(this._player)
        this.config_eventos()
        this.config_cursor()
        
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

    crear_objetos(map) {

        // Se obtiene el jugador que proviene del Manager
        const objectLayer = map.getObjectLayer('objects')
        const playerRespawnPosition = objectLayer.objects.find(objecto => objecto.type === 'PlayerRespawn')
        this._player = this.config_jugador(playerRespawnPosition.x, playerRespawnPosition.y)
        this.crearColliderConSuelo(this._player)
        this.crearColliderConPared(this._player)

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
                const type = undefined
                const enemigo = this.addEnemy(type, object.x, object.y)
                this._listaEnemigos.push(enemigo)
            }
            else if(object.type === 'FinalPosition') {
                this._finalPosition = { x: object.x, y: object.y }
            }
            else if(object.type === 'BlueLightPoint') {
                this.lights.addLight(object.x, object.y, 250, 0x8888ff, 0.5)
            }
            else if(object.type === 'Console'){
                const password = object.properties[0].value
                const laserID = 31  // TODO - MUY PROVISIONAL
                let consoles = new Console(this, object.x + 55, object.y - 50, password, laserID)
                this.listaConsolas.push(consoles)
            }
            else if(object.type === 'Laser'){
                const laserID = object.id
                let laser = new Laser(this, object.x + 55, object.y - 55, laserID)
                this.listaLaseres.push(laser)
            }
            else if(object.type === 'Note'){
                const text = object.properties[0].value
                let note = new Note(this, object.x, object.y, text)
            }
            else if(object.type === 'Door'){
                const isActivated = object.properties[0].value
                const doorID = object.id
                let door = new Door(this, object.x + 55, object.y - 55, isActivated, doorID)
                this.listaPuertas.push(door)
            }
            else if(object.type === 'BatteryStructure'){
                const doorID = 36
                const numBaterias = 2   // TODO - MUY PROVISIONAL
                const consolaBateria = new BatteryStructure(this, object.x + 55, object.y - 55 , doorID, numBaterias)
                this.listaEstructuraBaterias.push(consolaBateria)
            }
        })

        //Aqui se crean los textos del mapa que contienen informacion importante
        //y asi mismo los puntos de respawn del personaje principal, de los enemigos y la meta del mapa
        //Insercion del resto de objetos con sus respectivas clases
        var healthItems = map.createFromObjects('objects', { gid: 20, classType: Health, key: 'health' })
        var shieldItems = map.createFromObjects('objects', { gid: 21, classType: Shield, key: 'shield' })
        var batteryItems = map.createFromObjects('objects', { gid: 19, classType: BatteryItem, key: 'battery' })
        var coinItems = map.createFromObjects('objects', { gid: 22, classType: Coin, key: 'coinIcon' })
        this.boxes = map.createFromObjects('objects', { gid: 23, classType: Box, key: 'box' })

        // Se establecen las colisiones entre las cajas y las puertas con los personajes
        this.listaPuertas.forEach(door => {
            this._charactersGroup.addCollision(door)
        })
        this.physics.add.collider(this._player, this.listaPuertas)

        this.boxes.forEach(box => {
            this._charactersGroup.addCollision(box)
        })
        this.physics.add.collider(this._player, this.boxes)
        
        // Gestion de colisiones entre objetos de tiled y el player
        this._charactersGroup.addElement(this._player)
        this._listaEnemigos.forEach(enemigo => {
            this._charactersGroup.addElement(enemigo)
            this.crearColliderConSuelo(enemigo)
            this.crearColliderConPared(enemigo)
        })

        // Configurar el resto de objetos
        this.config_characters()
    }


    addEnemy(enemyType, x, y){

        return new ExtendedEnemy(this, x, y)
    }

    activar_laseres(laserID){
        this.listaLaseres.forEach(laser => {
            if(laserID === laser.get_laser_ID())
                laser.activate_laser()
        })
    }

    desactivar_laseres(laserID){
        this.listaLaseres.forEach(laser => {
            if(laserID === laser.get_laser_ID())
                laser.disable_laser()
        })
    }

    activar_puertas(doorID){

        this.listaPuertas.forEach(door => {
            if(doorID === door.getID())
                door.set_active(true)
        })
    }

    gameOver(){
       console.log('Game over')
       this.scene.restart()
    }

    get_player(){
        return this._player
    }

    config_jugador(x, y) {

        var player = new Player(this, x, y)
        player.body.setCollideWorldBounds(true)
        player.body.setImmovable(true)
        return player
    }

    config_characters() {
        
        this._objectsCollider = this.physics.add.staticGroup()
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
                this._objectsCollider.add(collider)
            }
        })
        this.physics.add.collider(this._player, this._objectsCollider)

        this._paredColliders = this.physics.add.staticGroup()
        this._layerPared.forEachTile(tile => {
            if (tile.index !== -1) { // Solo creamos colisión en los tiles que existen
                const collider = this.physics.add.staticImage(tile.getCenterX(), tile.getCenterY(), null)
                collider.body.setSize(tile.width, tile.height)
                collider.setVisible(false)
                this._paredColliders.add(collider)
            }
        })

        this._listaEnemigos.forEach(enemigo => {
            this.physics.add.collider(enemigo, this._objectsCollider)
            this.physics.add.collider(enemigo, this._player)
            this.physics.add.collider(this._player, enemigo)
        })
        

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
        this.physics.add.collider(this._grupoBalas, this._objectsCollider, onBulletCollision)
        this.physics.add.collider(this._grupoBalas, this._paredColliders, onBulletCollision)

        this._listaEnemigos.forEach(enemigo => {
            this.physics.add.collider(this._grupoBalas, enemigo, onBulletCollision)
        })
        this.boxes.forEach(box => {
            this.physics.add.collider(this._grupoBalas, box, onBulletCollision)
        })
        this.listaPuertas.forEach(door => {
            this.physics.add.collider(this._grupoBalas, door, onBulletCollision)
        })
        this._grupoObjectos = this.physics.add.staticGroup()
        this.physics.add.overlap(this._player, this._grupoObjectos)  
    }

    config_iluminacion(capas){

        for(let i = 0; i < capas.length; i++)
            capas[i].setPipeline('Light2D')

        this.lights.enable()
        this.lights.setAmbientColor(0x777777)
    }

    config_camara(player){
        this.cameras.main.startFollow(player)
    }

    config_cursor(){
        this.input.setDefaultCursor('crosshair')
    }

    config_eventos(){

        // Evento para abrir el menu de ajustes
        this.input.keyboard.on(Options.TECLA_PAUSA, () => {
            this.scene.switch('settings', this.scene.key)
        }, this)

    }

    config_musica(){

        //this.ambient = this.sound.add('ambiente')
        //const ambient = this.sound.add('ambiente')
        //this.ambient.setVolume(0.5)
        //this.ambient.play()
    }

    config_efectos_sonido(){

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