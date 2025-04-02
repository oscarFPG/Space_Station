import Phaser from 'phaser';

export default class BaseGroup {
    constructor(scene, collisionWorld, inmova, collisionBtw, elements, layer) {
        this.scene = scene;
        this.group = this.scene.physics.add.group({
            collideWorldBounds:collisionWorld,
            inmovable:inmova
            });
        if(collisionBtw) {

            this.scene.physics.add.collider(this.group, this.group);
        }
        if (elements != null) 
        {
            for(let index = 0; index < elements.length; ++index) {

                addElement(elements[index]);
            }
        }
        if(layer != null) {
            this.scene.physics.add.collider(this.group, layer);
        }
    }
    addCollision(gameobject) {
        this.scene.physics.add.collider(this.group, gameobject);
    }
    getGroup() 
    {
        return this.group;
    }
    addElement(gameobject) {
        this.group.add(gameobject);
    }
}