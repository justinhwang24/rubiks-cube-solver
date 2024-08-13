import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import Cubie from './Cubie.js';

class Face {
    constructor(name) {
        this.name = name; // 'U', 'D', 'L', 'R', 'F', 'B'
        this.cubies = [];
    }

    addCubie(cubie) {
        if (!this.cubies.includes(cubie)) {
            this.cubies.push(cubie);
        }
    }

    // rotateFace(clockwise) {
    //     console.log(`Rotating ${this.name} face, clockwise ${clockwise}`);
    //     const angle = clockwise ? Math.PI / 2 : -Math.PI / 2;
    //     const axis = this.getRotationAxis();
    
    //     const rotation = new THREE.Quaternion().setFromAxisAngle(axis, angle);
    
    //     this.cubies.forEach(cubie => cubie.rotate(rotation));
    // }    

    rotateFace(clockwise) {
        console.log(`Rotating ${this.name} face, clockwise ${clockwise}`);
        const angle = clockwise ? Math.PI / 2 : -Math.PI / 2;
        const axis = this.getRotationAxis();

        // Calculate the face center
        const faceCenter = this.getFaceCenter();

        // Perform rotation on each cubie
        this.cubies.forEach(cubie => {
            const cubiePos = new THREE.Vector3().copy(cubie.getMesh().position);
    
            // Move cubie to face center
            cubiePos.sub(faceCenter);
    
            // Rotate cubie around the face center using a quaternion
            const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
            cubiePos.applyQuaternion(quaternion);
    
            // Move cubie back to its original position
            cubiePos.add(faceCenter);
    
            // Update the cubie's position
            cubie.getMesh().position.copy(cubiePos);
    
            // Optionally, rotate the cubie's orientation as well
            cubie.getMesh().applyQuaternion(quaternion);
        });
    }

    getRotationAxis() {
        // Define the axis based on the face
        switch (this.name) {
            case 'U':
                return new THREE.Vector3(0, -1, 0);
            case 'D':
                return new THREE.Vector3(0, 1, 0);
            case 'L':
                return new THREE.Vector3(1, 0, 0);
            case 'R':
                return new THREE.Vector3(-1, 0, 0);
            case 'F':
                return new THREE.Vector3(0, 0, -1);
            case 'B':
                return new THREE.Vector3(0, 0, 1);
        }
    }

    getFaceCenter() {
        // Compute the center position of the face based on the face name
        switch (this.name) {
            case 'U':
                return new THREE.Vector3(0, 1, 0);
            case 'D':
                return new THREE.Vector3(0, -1, 0);
            case 'L':
                return new THREE.Vector3(-1, 0, 0);
            case 'R':
                return new THREE.Vector3(1, 0, 0);
            case 'F':
                return new THREE.Vector3(0, 0, 1);
            case 'B':
                return new THREE.Vector3(0, 0, -1);
            default:
                return new THREE.Vector3();
        }
    }

    getName() {
        return this.name;
    }

    toString() {
        console.log(`Cubies on face ${this.name}: ${this.cubies.length}`);
        this.cubies.forEach(cubie => {
            console.log(cubie.toString());
        });
    }
}

export default Face;
