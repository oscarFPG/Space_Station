import Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {

    static EXPLODE_ANIMATION = 'explode'; // Nombre de la animación

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        // Almacenar la referencia a la escena
        this.myScene = scene;

        this.myScene.add.existing(this);
        this.myScene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;

        // Crear la animación "spark" (usando la textura 'explode' ya cargada)
        if (!scene.anims.exists('spark')) {
            scene.anims.create({
                key: 'spark',
                frames: scene.anims.generateFrameNumbers('explode', { start: 0, end: 7 }),
                frameRate: 5,
                repeat: 0
            });
        }

        // Listener para cuando la bala toca los límites del mundo
        this.body.world.on('worldbounds', (body) => {
            if (body.gameObject === this) {
                // Solo intentamos crear la chispa si aún tenemos referencia a la escena
                if (this.myScene) {
                    this.createSpark(this.x, this.y);
                }
                this.destroy();
            }
        });
    }

    fire(x, y, angle, speed) {
        this.setPosition(x, y);
        this.setRotation(angle);
        this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    }

    createSpark(x, y) {
        // Verificar que myScene sigue existiendo
        if (!this.myScene) {
            return;
        }
        // Usamos this.myScene en lugar de this.scene
        const spark = this.myScene.add.sprite(x, y, 'explode');
        spark.setOrigin(0.5, 0.5);
        // Asignar la rotación de la bala (o la que desees) al spark
        spark.setRotation(this.rotation);
        spark.play('spark');
        spark.on('animationcomplete', () => {
            spark.destroy();
        });
    }
}
