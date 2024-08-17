import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

export default class Cubie {
    constructor(position, size, colors) {
        this.position = position;
        this.faces = {};
        this.size = size;
        this.colors = colors; // colors should be an array of colors for each face

        this.name = '';
        this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
        this.materials = this.colors.map(color => new THREE.MeshBasicMaterial({ color }));

        this.mesh = new THREE.Mesh(this.geometry, this.materials);
        this.mesh.position.set(position.x, position.y, position.z);

        this.initEdges();
    }

    initEdges() {
        const edgesGeometry = new THREE.EdgesGeometry(this.geometry);
        const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        this.mesh.add(edges);
    }

    getMesh() {
        return this.mesh;
    }

    updatePosition() {
        this.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
    }

    // updatePositionAfterRotation(cubeGroupQuaternion) {
    //     if (!this.mesh || !this.mesh.position) {
    //         console.error('Mesh or mesh position is undefined for this cubie.');
    //         return;
    //     }

    //     const newPosition = new THREE.Vector3().copy(this.mesh.position);
    //     newPosition.applyQuaternion(cubeGroupQuaternion);
    
    //     // Round the position to avoid precision errors
    //     newPosition.x = Math.round(newPosition.x);
    //     newPosition.y = Math.round(newPosition.y);
    //     newPosition.z = Math.round(newPosition.z);
    
    //     this.position.set(newPosition.x, newPosition.y, newPosition.z);
    // }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }
    
    toString() {
        return `Cubie ${this.name}\nPosition: ${this.mesh.position.toArray().join(', ')}; Rotation: ${this.mesh.rotation.toArray().join(', ')}`;
    }    
}
