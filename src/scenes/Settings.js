import Phaser from 'phaser'
import BaseScene from './BaseScene.js'
import Options from '../managers/Options.js'

export default class Settings extends BaseScene {

    constructor(){
        super('settings')
    }

    init(data){
        this._previousScene = data.previousScene
    }

    create() {
        super.create()
    
        const { width, height } = this.scale //este metodo lo he puesto para no tener que poner numeros asi randoms, lo saca mas o menos centralizado
    
        // se vuelve toda la pantalla mas o menos opaca
        this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0) //el 0,5 es para la opacidad, ahi hace un rectangulo que se ve un poco transparente
    
        // Panel central
        const panelW = 600//para lo ancho 
        const panelH = 220//para la altura
        const panelX = (width  - panelW) / 2
        const panelY = (height - panelH) / 2
    
        const panel = this.add.rectangle(panelX, panelY, panelW, panelH,0x222222, 0.9) //los dos ultimos son para el relleno del rectangulo y la opacidad
          .setOrigin(0)
          .setStrokeStyle(4, 0x7DF9FF)//el setStroke hace un rectangulo asi por fuera, solo como decoracion
    
        // Título
        this.add.text(width/2, panelY + 30, 'PAUSA', {
          fontSize: '36px',
          color: '#7DF9FF'
        }).setOrigin(0.5)
    
        // Lista de botones con su etiqueta y callback
        const botones = [
          { text: 'Ajustes de Volumen',   onClick: () => this.onVolumeSettings() },
          { text: 'Ajustes de Controles', onClick: () => this.onControlSettings() },
          { text: 'Reiniciar Nivel', onClick: () => {
            this.scene.stop(this._previousScene)
            this.scene.start(this._previousScene)
            this.scene.stop() // cerrar ajustes
          }}
        ]
    
        // Espaciado vertical
        const startY = panelY + 80
        const spacing =  50 //distancia entre cada opcion
    
        botones.forEach((btn, i) => { //hacemos el bucle para cada boton y para dibujarlo
          const y = startY + i * spacing
          // fondo para cada boton
          const bg = this.add.rectangle(width/2, y, panelW - 40,  45, 0x444444, 1)//el 40 
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true }) /*esta funcion la vi en un ejemplo, no se que tal funcionara la verdad
            de momento, lo hace clicable y el raton es una mano para darle.*/
            .on('pointerover',  () => bg.setFillStyle(0x666666)) //esto hace que cambie de color cuando el raton esta en cima
            .on('pointerout',   () => bg.setFillStyle(0x444444))//cuando el raton no esta mas en cima se va y vuelve a su color.
            .on('pointerdown',  btn.onClick)
    
          // Texto
          this.add.text(width/2, y, btn.text, {
            fontSize: '24px',
            color: '#7DF9FF'
          }).setOrigin(0.5)
        })
    
        // Configuramos ESC para volver
        this.config_eventos()
      }

    update(time, delta){

    }

    config_eventos() {
        // Reemplazamos el switch por stop+resume
        this.input.keyboard.on(Options.TECLA_PAUSA, () => {
            // 1) Cerramos la escena de settings
            this.scene.stop()
            // 2) Reanudamos la escena del juego
            this.scene.resume(this._previousScene)
        }, this)
    }
    onVolumeSettings() {
        this.scene.pause(); // Cerramos settings
        this.scene.launch('volumeSettings', { previousScene: this._previousScene });
      }

}