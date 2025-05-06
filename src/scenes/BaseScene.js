import Phaser from 'phaser'
import Player from '../game-objects/characters/Player.js'
import Bullet from '../game-objects/base-game-objects/Bullet.js'
import Options from '../managers/Options.js'
import BaseGroup from '../game-objects/objects/BaseGroup.js'
import Note from '../game-objects/objects/Note.js'
import Console from '../game-objects/objects/Console.js'
import Laser from '../game-objects/objects/Laser.js'
import Seller from '../game-objects/objects/Seller.js'
import Health from '../game-objects/objects/Health.js'
import Shield from '../game-objects/objects/Shield.js'
import Coin from '../game-objects/objects/Coin.js'
import WeaponObject from '../game-objects/objects/WeaponObject.js'
import Box from '../game-objects/objects/Box.js'
import BoxHard from '../game-objects/objects/BoxHard.js'
import BatteryStructure from '../game-objects/objects/BatteryStructure.js'
import Door from '../game-objects/objects/Door.js'
import EnemyFactory from '../factories/EnemyFactory.js';
import WeaponFactory from '../factories/WeaponFactory.js';
import AmmoFactory from '../factories/AmmoFactory.js';
import Battery from '../game-objects/objects/Battery.js'


export default class BaseScene extends Phaser.Scene {

    static LAYER_SUELO = 'floor'
    static LAYER_SUELO2 = 'floor2'
    static LAYER_PARED = 'wall'
    static LAYER_OBJETO = 'objects'

    _previousScene = null
    _nextScene = null

    constructor(sceneKey){
        super({ key: sceneKey })
    }

    // IMPORTANTE - cualquier escena que herede de esta clase debe invocar 
    // SIEMPRE esta funcion con super.create()

    init(data) {
        this.playerHealth   = data.health
        this.playerShield   = data.shield
        this.playerMoney    = data.money
        this.playerWeapon1  = data.weapon1
        this.playerWeapon2  = data.weapon2
        this._previousScene = data.previousScene

        this._isTransitioning = false;
    }
    create(map, tileset, nextScene){

        if(map == null || tileset == null)
            return


        this.listaConsolas = []
        this.listaLaseres = []
        this.listaPuertas = []
        this.listaEstructuraBaterias = []
        this.listaTorretas = []
        this.listaNotas = []
        this._listaEnemigos = []
        this.listaEscudos = []
        this.listaVidas = []
        this.listaBaterias = []
        this.listaMonedas = []
        this.listaMuniciones = []
        this.listaVendedores = []
        this.listaObjetosArmas = []

        //Capa de todos los textos del nivel
        this.uiLayer = this.add.layer();
        this.uiLayer.setDepth(1000); // Profundidad muy alta

        // Capas de todos los niveles
        this._layerSuelo = map.createLayer(BaseScene.LAYER_SUELO, tileset, 0, 0)
        this._layerSuelo2 = map.createLayer(BaseScene.LAYER_SUELO2, tileset, 0, 0)
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
        this.config_iluminacion([this._layerSuelo, this._layerSuelo2, this._layerPared, this._layerObjeto])
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
        this.cameras.main
            .fadeIn(700, 0, 0, 0);
        //this.scene.launch('')
    }

    update(time, delta){

        if (this._finalPosition && this._player) {
            const distance = Phaser.Math.Distance.Between(
                this._player.x, this._player.y,
                this._finalPosition.x, this._finalPosition.y
            )
            if (distance < 100 && this._nextScene) { 
                const status = this._player.getPlayerStatus(this._previousScene)
                this.scene.start(this._nextScene, status);
                //Efecto 
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start(this._nextScene, status);
                });
                this.cameras.main.fadeOut(700, 0, 0, 0);
            }
        }
        if(this.listaVendedores) {
            this.listaVendedores.forEach(vendedor => {
                vendedor.update();
            });
        }

        if (this.listaPuertas) {
            this.listaPuertas.forEach(door => {
                door.update();
            });
        }
        
        if (this._listaEnemigos) {
            this._listaEnemigos.forEach(enemigo => {
                enemigo.update();
            });
        }
        
        if (this.listaVidas) {
            this.listaVidas.forEach(healthItem => {
                healthItem.update(time);
            });
        }
        
        if (this.listaEscudos) {
            this.listaEscudos.forEach(shieldItem => {
                shieldItem.update(time);
            });
        }
        
        if (this.listaBaterias) {
            this.listaBaterias.forEach(batteryItem => {
                batteryItem.update(time);
            });
        }
        
        if (this.listaNotas) {
            this.listaNotas.forEach(nota => {
                nota.update(time);
            });
        }
        
        if (this.listaMuniciones) {
            this.listaMuniciones.forEach(ammo => {
                ammo.update(time);
            });
        }
        
        if (this.listaObjetosArmas) {
            this.listaObjetosArmas.forEach(arma => {
                arma.update(time);
            });
        }        
        
    }

    crear_objetos(map) {

        // Se obtiene el jugador que proviene del Manager
        const objectLayer = map.getObjectLayer('objects')
        const playerRespawnPosition = objectLayer.objects.find(objecto => objecto.type === 'PlayerRespawn')
        this.firstWeapon = null
        if (this.playerWeapon1) {
            this.firstWeapon = WeaponFactory.crearArma(this.playerWeapon1.key, this, this.playerWeapon1.offset);
            this.firstWeapon.setCurrentAmmo(this.playerWeapon1.CurrentAmmo);
            this.firstWeapon.setReserveAmmo(this.playerWeapon1.ReserveAmmo);
        }
        this.secondWeapon = null;
        if (this.playerWeapon2) {
            this.secondWeapon = WeaponFactory.crearArma(this.playerWeapon2.key, this, this.playerWeapon2.offset);
            this.secondWeapon.setCurrentAmmo(this.playerWeapon2.CurrentAmmo);
            this.secondWeapon.setReserveAmmo(this.playerWeapon2.ReserveAmmo);
        }
        this._player = this.config_jugador(playerRespawnPosition.x, playerRespawnPosition.y,
            this.playerHealth,
            this.playerShield,
            this.playerMoney,
            this.firstWeapon,
            this.secondWeapon
        )
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
                const type = object.properties[0].value
                const enemigo = this.addEnemy(type, object.x, object.y)
                this._listaEnemigos.push(enemigo)
            }
            else if(object.type == 'AmmoBox'){
                const type = object.properties[0].value
                const ammo = this.addAmmoBox(type, object.x + 55, object.y - 55)
                this.listaMuniciones.push(ammo);
            }
            else if(object.type == 'Weapon'){
                const type = object.properties[0].value
                const reserveAmmo = object.properties[1].value
                const currentAmmo = object.properties[2].value
                let weaponObject = new WeaponObject(this, object.x + 55, object.y - 55, type, currentAmmo, reserveAmmo)
                this.listaObjetosArmas.push(weaponObject);
            }
            else if(object.type === 'FinalPosition') {
                this._finalPosition = { x: object.x, y: object.y }
            }
            else if(object.type === 'BlueLightPoint') {
                this.lights.addLight(object.x, object.y, 1250, 0xFFFFFF, 1.35)
            }
            else if(object.type === 'Console'){
                const laserID = object.properties[0].value
                const password = object.properties[1].value
                let consoles = new Console(this, object.x + 55, object.y - 50, password, laserID)
                this.listaConsolas.push(consoles)
            }
            else if(object.type === 'Laser'){
                const laserID = object.properties[1].value
                const isHorizontal = object.properties[2].value
                const isStatic = object.properties[3].value
                let laser = new Laser(this, object.x + 55, object.y - 55, laserID, isHorizontal, isStatic)
                this.listaLaseres.push(laser)
            }
            else if(object.type === 'Note'){
                const text = object.properties[0].value
                let note = new Note(this, object.x + 55, object.y - 55, text)
                this.listaNotas.push(note)
            }
            else if(object.type === 'Door'){
                const doorID = object.properties[0].value
                const isActivated = object.properties[1].value
                let door = new Door(this, object.x + 55, object.y - 55, isActivated, doorID)
                this.listaPuertas.push(door)
            }
            else if(object.type === 'BatteryStructure'){
                const doorID = object.properties[0].value
                const numBaterias = object.properties[1].value
                const consolaBateria = new BatteryStructure(this, object.x + 55, object.y - 55 , doorID, numBaterias)
                this.listaEstructuraBaterias.push(consolaBateria)
            }
            else if(object.type == 'Battery'){
                const bateria = new Battery(this, object.x + 55, object.y - 55)
                this.listaBaterias.push(bateria);
                // No se coloca en la posicion del tiled si no se le suma o resta. Ni idea, pero NO QUITAR O CAMBIAR !!!
            }
            else if(object.type == 'HealthKit'){
                const healthObject = new Health(this, object.x + 55, object.y - 55)
                this.listaVidas.push(healthObject);
                // No se coloca en la posicion del tiled si no se le suma o resta. Ni idea, pero NO QUITAR O CAMBIAR !!!
            }
            else if(object.type == 'ShieldKit'){
                const shieldObject = new Shield(this, object.x + 55, object.y - 55)
                this.listaEscudos.push(shieldObject);
                // No se coloca en la posicion del tiled si no se le suma o resta. Ni idea, pero NO QUITAR O CAMBIAR !!!
            }
            else if(object.type == 'Coin'){
                const coinObject = new Coin(this, object.x + 55, object.y - 55, null)
                this.listaMonedas.push(coinObject);
                // No se coloca en la posicion del tiled si no se le suma o resta. Ni idea, pero NO QUITAR O CAMBIAR !!!
            }
            else if(object.type == 'Seller'){
                const seller = new Seller(this, object.x + 55, object.y - 55, null)
                this.listaVendedores.push(seller);
                // No se coloca en la posicion del tiled si no se le suma o resta. Ni idea, pero NO QUITAR O CAMBIAR !!!
            }
            else if(object.type === '' /* TODO - Incluir tipo para la tienda */){

            }
        })

        //Aqui se crean los textos del mapa que contienen informacion importante
        //y asi mismo los puntos de respawn del personaje principal, de los enemigos y la meta del mapa
        //Insercion del resto de objetos con sus respectivas clases
        this.boxes = map.createFromObjects('objects', { gid: 23, classType: Box, key: 'objCaja' })
        this.boxesHard = map.createFromObjects('objects', { gid: 29, classType: BoxHard, key: 'objCaja2' })

        // Se establecen las colisiones entre las cajas y las puertas con los personajes
        this.listaPuertas.forEach(door => {
            this._charactersGroup.addCollision(door)
        })
        this.listaTorretas.forEach(turret => {
            this._charactersGroup.addCollision(turret)
        })

        this.physics.add.collider(this._player, this.listaPuertas)

        this.boxes.forEach(box => {
            this._charactersGroup.addCollision(box)
        })
        this.boxesHard.forEach(boxHard => {
            this._charactersGroup.addCollision(boxHard)
        })
        this.physics.add.collider(this._player, this.boxes)
        this.physics.add.collider(this._player, this.boxesHard)
        
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
        return EnemyFactory.createEnemy(enemyType, this, x, y)
    }

    addAmmoBox(ammoType, x, y){
        return AmmoFactory.createAmmoBox(ammoType, this, x, y)
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

    gameOver() {
        console.log('Game over');
        this.ambient = this.sound.add('player_dead') 
        this.ambient.setVolume(0.5)
        this.ambient.play()
        const blurPipeline = this.cameras.main.postFX.addBlur(4); 
        
        this.cameras.main.fadeOut(500, 0, 0, 0);
    
        this.time.delayedCall(400, () => {
            this.scene.restart();
        });
    }
    

    get_player(){
        return this._player
    }


    config_jugador(x, y, health, shield, money, firstWeapon, secondaryWeapon) {

        var player = new Player(this, x, y, health, shield, money, firstWeapon, secondaryWeapon)
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
            this.ambient = this.sound.add('impact_shot') 
            this.ambient.setVolume(0.08)
            this.ambient.play()
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
        this.listaTorretas.forEach(turret => {
            this.physics.add.collider(this._grupoBalas, turret, onBulletCollision)
        })
        this.boxes.forEach(box => {
            this.physics.add.collider(this._grupoBalas, box, onBulletCollision)
        })
        this.boxesHard.forEach(box => {
            this.physics.add.collider(this._grupoBalas, box, onBulletCollision)
        })
        this.listaPuertas.forEach(door => {
            this.physics.add.collider(this._grupoBalas, door, onBulletCollision)
        })
        this._grupoObjectos = this.physics.add.staticGroup()
        //let group = new BaseGroup(this, true, true, true, [], this._layerPared);
        //Se añaden los personajes al BaseGroup 
        //group.addElement(this._player);
        this.physics.add.overlap(this._player, this._grupoObjectos)  
    }

    config_iluminacion(capas){

        for(let i = 0; i < capas.length; i++)
            capas[i].setPipeline('Light2D')

        this.lights.enable()
        this.lights.setAmbientColor(0x666666)
    }

    config_camara(player){
        this.cameras.main.startFollow(player)
    }

    config_cursor(){
        this.input.setDefaultCursor('crosshair')
    }

    config_eventos() {
        this.input.keyboard.on(Options.TECLA_PAUSA, () => {
           //para pausar el juego
            this.scene.pause(this.scene.key)
            // lanza la escena de ajustes
            this.scene.launch('settings', { previousScene: this.scene.key })
        }, this)
    }

    config_musica(){
        this.sound.stopAll();
        this.ambient = (this.scene.key == 'Level5_2') ? this.sound.add('final boss', 
            { volume: 0.3, loop: true }) : this.sound.add('ambiente', { volume: 0.3, loop: true })
        this.ambient.play()
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
    putFinalTheme(value) { 
        this.sound.stopAll();
        this.ambient = this.sound.add('final game',{ volume: 0.3, loop: true })
        this.ambient.play()
    }
}