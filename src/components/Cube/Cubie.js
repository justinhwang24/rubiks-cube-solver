import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

export default class Cubie {
    constructor(position, size, colors) {
        this.position = position;
        this.faces = {};
        this.size = size;
        this.colors = colors; // colors should be an array of colors for each face

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

    rotateFace(face, direction) {
        const angle = direction === 'clockwise' ? Math.PI / 2 : -Math.PI / 2;
        const axis = new THREE.Vector3(0, 0, 1); // Default axis

        switch (face) {
            case 'U':
                axis.set(0, 1, 0); // Up face rotates around the Y-axis
                break;
            case 'D':
                axis.set(0, -1, 0); // Down face rotates around the Y-axis
                break;
            case 'L':
                axis.set(0, 0, 1); // Left face rotates around the Z-axis
                break;
            case 'R':
                axis.set(0, 0, -1); // Right face rotates around the Z-axis
                break;
            case 'F':
                axis.set(1, 0, 0); // Front face rotates around the X-axis
                break;
            case 'B':
                axis.set(-1, 0, 0); // Back face rotates around the X-axis
                break;
        }

        const rotation = new THREE.Quaternion().setFromAxisAngle(axis, angle);
        this.mesh.quaternion.multiply(rotation);
    }
}
