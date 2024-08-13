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

    rotateFace(direction) {
        const angle = direction === 'clockwise' ? Math.PI / 2 : -Math.PI / 2;
        const axis = this.getRotationAxis();

        const rotation = new THREE.Quaternion().setFromAxisAngle(axis, angle);

        this.cubies.forEach(cubie => cubie.rotate(rotation));
    }

    getRotationAxis() {
        // Define the axis based on the face
        switch (this.name) {
            case 'U':
            case 'D':
                return new THREE.Vector3(0, 1, 0); // Y-axis for Up and Down
            case 'L':
            case 'R':
                return new THREE.Vector3(0, 0, 1); // Z-axis for Left and Right
            case 'F':
            case 'B':
                return new THREE.Vector3(1, 0, 0); // X-axis for Front and Back
        }
    }
}

export default Face;
