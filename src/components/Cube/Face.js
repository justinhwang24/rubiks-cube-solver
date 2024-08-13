import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import Cubie from './Cubie.js';

class Face {
    constructor(name, cube) {
        this.name = name; // 'U', 'D', 'L', 'R', 'F', 'B'
        this.cubies = [];
        this.cube = cube;
    }

    addCubie(cubie) {
        if (!this.cubies.includes(cubie)) {
            this.cubies.push(cubie);
        }
    }

    rotateFace(clockwise) {
        console.log(`Rotating ${this.name} face, clockwise ${clockwise}`);
        const targetAngle = clockwise ? Math.PI / 2 : -Math.PI / 2;
        const axis = this.getRotationAxis();
        const duration = 0.5; // Animation duration in seconds
    
        const initialPositions = [];
        const initialRotations = [];
        
        // Store initial positions and rotations
        this.cubies.forEach(cubie => {
            const mesh = cubie.getMesh();
            initialPositions.push(mesh.position.clone());
            initialRotations.push(mesh.quaternion.clone());
        });
    
        const clock = new THREE.Clock();
        const animateRotation = () => {
            const elapsedTime = clock.getElapsedTime();
            const progress = Math.min(elapsedTime / duration, 1); // Clamp progress to 1
            
            this.cubies.forEach((cubie, index) => {
                const mesh = cubie.getMesh();
                
                // Calculate the current angle for this frame
                const currentAngle = progress * targetAngle;
                
                // Reset to initial position and rotation
                mesh.position.copy(initialPositions[index]);
                mesh.quaternion.copy(initialRotations[index]);
                
                // Apply rotation around the center of the cube
                mesh.position.applyAxisAngle(axis, currentAngle);
                mesh.rotateOnWorldAxis(axis, currentAngle);
            });
    
            if (progress < 1) {
                requestAnimationFrame(animateRotation);
            }
            else {
                this.cubies.forEach(cubie => cubie.updatePosition());
                this.cube.updateFaceAssignments();
            }
        };
    
        animateRotation();
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
