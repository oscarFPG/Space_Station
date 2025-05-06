import Phaser from 'phaser';
import Options from '../../managers/Options.js';


export default class Bullet extends Phaser.Physics.Arcade.Sprite {

    static EXPLODE_ANIMATION = 'explode'; // Nombre de la animación

    constructor(scene, x, y, texture, damage, color) {
        super(scene, x, y, texture);
        this._damage = damage;

        // Almacenar la referencia a la escena
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.light = this.scene.lights.addLight(this.x, this.y, 600, color, 1.5);

        // Crear la animación "spark" (usando la textura 'explode' ya cdsargada)
        if (!scene.anims.exists('spark')) {
            scene.anims.create({
                key: 'spark',
                frames: scene.anims.generateFrameNumbers('explode', { start: 0, end: 7 }),
                frameRate: 5,
                repeat: 0
            });
        }
        
        // Esperar un breve tiempo antes de verificar superposiciones
        scene.time.delayedCall(10, () => {
            const checkOverlapAndDestroy = (bala, obj) => {
                if (obj.quitarVida) obj.quitarVida(bala._damage)
                if (bala.active) {
                    bala.createSpark(bala.x, bala.y);
                    bala.destroy();
                }
            };
            scene.physics.world.overlap(this, scene._objectsCollider, checkOverlapAndDestroy);
            scene.physics.world.overlap(this, scene.boxes, checkOverlapAndDestroy);
            scene.physics.world.overlap(this, scene.boxesHard, checkOverlapAndDestroy);
            scene.physics.world.overlap(this, scene.doors, checkOverlapAndDestroy);
            scene.physics.world.overlap(this, scene._paredColliders, checkOverlapAndDestroy);
        });

        // Listener para cuando la bala toca los límites del mundo
        this.body.world.on('worldbounds', (body) => {
            if (body.gameObject === this) {
                // Solo intentamos crear la chispa si aún tenemos referencia a la escena
                if (this.scene) {
                    this.createSpark(this.x, this.y);
                }
                this.destroy();
            }
        });

    }

    fire(x, y, angle, speed) {

        const options = Options.get_instance();
        options.playSound(this.scene, 'gun_sound', { isMusic: false, volume: 0.4 });
        this.setPosition(x, y);
        this.setRotation(angle);

        // Se aplica la velocidad en esa dirección
        this.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        //Se ajusta el body según su orientación
        const w = this.body.width, h = this.body.height;
        if (Math.abs(angle) > Math.PI/4 && Math.abs(angle) < 3*Math.PI/4) {
            this.body.setSize(h, w);
        } else {
            this.body.setSize(w, h);
        }
    }
    
    // Sobrescribimos preUpdate para actualizar la posición de la luz
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.light) {
            this.light.x = this.x;
            this.light.y = this.y;
        }
    }

    createSpark(x, y) {

        // Verificar que scene sigue existiendo
        if (!this.scene)
            return;

        // Usamos this.scene en lugar de this.scene
        const spark = this.scene.add.sprite(x, y, 'explode');
        spark.setOrigin(0.5, 0.5);
        // Asignar la rotación de la bala (o la que desees) al spark
        spark.setRotation(this.rotation);
        spark.play('spark');
        spark.on('animationcomplete', () => {
            spark.destroy();
        });
    }

    // Sobrescribimos destroy para eliminar la luz y el listener
    destroy(fromScene) {

        // Eliminar el listener de worldbounds para evitar fugas de memoria
        if (this.body && this.body.world && this.worldBoundsCallback) {
            this.body.world.off('worldbounds', this.worldBoundsCallback);
        }
        if (this.light) {
            this.scene.lights.removeLight(this.light);
            this.light = null;
        }
        super.destroy(fromScene);
    }
}
