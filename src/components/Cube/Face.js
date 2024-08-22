import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import Cubie from './Cubie.js';

class Face {
    constructor(name, cube) {
        this.name = name; // 'U', 'D', 'L', 'R', 'F', 'B'
        this.cubies = [];
        this.cube = cube;
        this.colors = new Array(9).fill(this.name);
    }

    addCubie(cubie) {
        if (!this.cubies.includes(cubie)) {
            this.cubies.push(cubie);
        }
    }

    rotateFace(clockwise, duration = 0.5) {
        console.log(`Rotating ${this.name} ${clockwise ? '' : 'counter'}clockwise`);
        const targetAngle = clockwise ? Math.PI / 2 : -Math.PI / 2;
        const axis = this.getRotationAxis();
    
        const initialPositions = [];
        const initialRotations = [];
        
        // Store initial positions and rotations
        this.cubies.forEach(cubie => {
            console.log('Before rotation:', cubie.mesh.rotation, cubie.mesh.material.map.color);
            
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
                this.rotateColors(clockwise)
            }
        };
    
        animateRotation();
    }

    rotateColors(clockwise) {
        // Rotate current face
        const newColors = new Array(9).fill(null);

        const clockwiseMap = {
            0: 6, 1: 3, 2: 0,
            3: 7, 4: 4, 5: 1,
            6: 8, 7: 5, 8: 2
        };

        for (let i = 0; i < 9; i++) {
            newColors[i] = clockwise ? this.colors[clockwiseMap[i]] : 8 - this.colors[clockwiseMap[i]];
        }

        this.colors = newColors;

        // Rotate surrounding faces
        this.setSurroundingStickers(clockwise);
    }

    getSurroundingStickers() {
        const surroundingStickers = [];
        const faceNames = [];
        const indices = {};
    
        switch (this.name) {
            case 'U':
                faceNames.push('B', 'R', 'F', 'L');
                indices['B'] = [0, 1, 2];
                indices['R'] = [0, 1, 2];
                indices['F'] = [0, 1, 2];
                indices['L'] = [0, 1, 2];
    
                surroundingStickers.push(...this.cube.getFace('B').colors.slice(0, 3)); // Top row of B face
                surroundingStickers.push(...this.cube.getFace('R').colors.slice(0, 3)); // Top row of R face
                surroundingStickers.push(...this.cube.getFace('F').colors.slice(0, 3)); // Top row of F face
                surroundingStickers.push(...this.cube.getFace('L').colors.slice(0, 3)); // Top row of L face
                break;
            case 'D':
                faceNames.push('F', 'R', 'B', 'L');
                indices['F'] = [6, 7, 8];
                indices['R'] = [6, 7, 8];
                indices['B'] = [6, 7, 8];
                indices['L'] = [6, 7, 8];
    
                surroundingStickers.push(...this.cube.getFace('F').colors.slice(6, 9)); // Bottom row of F face
                surroundingStickers.push(...this.cube.getFace('R').colors.slice(6, 9)); // Bottom row of R face
                surroundingStickers.push(...this.cube.getFace('B').colors.slice(6, 9)); // Bottom row of B face
                surroundingStickers.push(...this.cube.getFace('L').colors.slice(6, 9)); // Bottom row of L face
                break;
            case 'L':
                faceNames.push('U', 'F', 'D', 'B');
                indices['U'] = [0, 3, 6];
                indices['F'] = [0, 3, 6];
                indices['D'] = [0, 3, 6]; // Reverse
                indices['B'] = [2, 5, 8]; // Reverse
    
                surroundingStickers.push(...this.cube.getFace('U').colors.filter((_, index) => index % 3 === 0)); // Left column of U face
                surroundingStickers.push(...this.cube.getFace('F').colors.filter((_, index) => index % 3 === 0)); // Left column of F face
                surroundingStickers.push(...this.cube.getFace('D').colors.filter((_, index) => index % 3 === 0).reverse()); // Left column of D face
                surroundingStickers.push(...this.cube.getFace('B').colors.filter((_, index) => index % 3 === 2).reverse()); // Right column of B face (reverse)
                break;
            case 'R':
                faceNames.push('U', 'B', 'D', 'F');
                indices['U'] = [2, 5, 8]; // Reverse
                indices['B'] = [0, 3, 6]; // Reverse
                indices['D'] = [2, 5, 8];
                indices['F'] = [2, 5, 8];
    
                surroundingStickers.push(...this.cube.getFace('U').colors.filter((_, index) => index % 3 === 2).reverse()); // Right column of U face
                surroundingStickers.push(...this.cube.getFace('B').colors.filter((_, index) => index % 3 === 0).reverse()); // Left column of B face (reverse)
                surroundingStickers.push(...this.cube.getFace('D').colors.filter((_, index) => index % 3 === 2)); // Right column of D face
                surroundingStickers.push(...this.cube.getFace('F').colors.filter((_, index) => index % 3 === 2)); // Right column of F face
                break;
            case 'F':
                faceNames.push('U', 'R', 'D', 'L');
                indices['U'] = [6, 7, 8];
                indices['R'] = [0, 3, 6]; // Reverse
                indices['D'] = [0, 1, 2];
                indices['L'] = [2, 5, 8]; // Reverse
    
                surroundingStickers.push(...this.cube.getFace('U').colors.slice(6, 9)); // Bottom row of U face
                surroundingStickers.push(...this.cube.getFace('R').colors.filter((_, index) => index % 3 === 0).reverse()); // Left column of R face
                surroundingStickers.push(...this.cube.getFace('D').colors.slice(0, 3)); // Top row of D face
                surroundingStickers.push(...this.cube.getFace('L').colors.filter((_, index) => index % 3 === 2).reverse()); // Right column of L face (reverse)
                break;
            case 'B':
                faceNames.push('U', 'L', 'D', 'R');
                indices['U'] = [0, 1, 2]; // Reverse
                indices['L'] = [0, 3, 6];
                indices['D'] = [6, 7, 8]; // Reverse
                indices['R'] = [2, 5, 8];
    
                surroundingStickers.push(...this.cube.getFace('U').colors.slice(0, 3).reverse()); // Top row of U face
                surroundingStickers.push(...this.cube.getFace('L').colors.filter((_, index) => index % 3 === 0)); // Left column of L face
                surroundingStickers.push(...this.cube.getFace('D').colors.slice(6, 9).reverse()); // Bottom row of D face
                surroundingStickers.push(...this.cube.getFace('R').colors.filter((_, index) => index % 3 === 2)); // Right column of R face (reverse)
                break;
        }
    
        return { stickers: surroundingStickers, faceNames, indices };
    }    

    setSurroundingStickers(clockwise) {
        const { stickers, faceNames, indices } = this.getSurroundingStickers();
    
        // Shift the stickers based on the rotation direction
        const shiftBy = clockwise ? 3 : -3;
    
        // Rotate the stickers array
        const rotatedStickers = stickers.slice(-shiftBy).concat(stickers.slice(0, -shiftBy));
    
        // Apply the rotated stickers back to the respective faces
        for (let i = 0; i < 4; i++) {
            const faceName = faceNames[i];
            const faceIndices = indices[faceName];
            this.cube.getFace(faceName).colors[faceIndices[0]] = rotatedStickers[i * 3];
            this.cube.getFace(faceName).colors[faceIndices[1]] = rotatedStickers[i * 3 + 1];
            this.cube.getFace(faceName).colors[faceIndices[2]] = rotatedStickers[i * 3 + 2];
        }
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
