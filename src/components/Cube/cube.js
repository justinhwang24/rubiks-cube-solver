import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { setupColorPicker } from './color-picker.js';
import Cubie from './Cubie.js';
import Face from './Face.js';

class Cube {
    constructor() {
        this.faces = {};

        this.createFaces();
        this.init();
    }

    createFaces() {
        const faceNames = ['U', 'D', 'L', 'R', 'F', 'B'];
        faceNames.forEach(name => {
            this.faces[name] = new Face(name);
        });
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, 400 / 400, 0.1, 1000);
        this.camera.position.set(3, 3, 3);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(400, 400);
        document.getElementById('cube-container').appendChild(this.renderer.domElement);

        this.cubeGroup = new THREE.Group();
        this.cubeGroup.rotation.order = 'YXZ';

        this.createRubiksCube();
        this.addAxesHelper();
        this.animate();
        setupColorPicker(this);
    }

    createRubiksCube() {
        const cubeSize = 0.8;
        const spacing = 0.05;

        const colors = {
            'U': 0xffffff, // White
            'D': 0xffff00, // Yellow
            'F': 0x00ff00, // Green
            'B': 0x0000ff, // Blue
            'L': 0xff8000, // Orange
            'R': 0xff0000  // Red
        };

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                    const materials = [
                        new THREE.MeshBasicMaterial({ color: (x === 1 ? colors['R'] : 0x000000) }), 
                        new THREE.MeshBasicMaterial({ color: (x === -1 ? colors['L'] : 0x000000) }), 
                        new THREE.MeshBasicMaterial({ color: (y === 1 ? colors['U'] : 0x000000) }), 
                        new THREE.MeshBasicMaterial({ color: (y === -1 ? colors['D'] : 0x000000) }), 
                        new THREE.MeshBasicMaterial({ color: (z === 1 ? colors['F'] : 0x000000) }), 
                        new THREE.MeshBasicMaterial({ color: (z === -1 ? colors['B'] : 0x000000) })
                    ];
                    const cubie = new Cubie(
                        new THREE.Vector3(x * (cubeSize + spacing), y * (cubeSize + spacing), z * (cubeSize + spacing)),
                        cubeSize,
                        materials.map(material => material.color.getHex())
                    );

                    // Add cubie to the appropriate faces
                    for (const face in this.faces) {
                        if (this.isCubieOnFace(cubie, face)) {
                            this.faces[face].addCubie(cubie);
                        }
                    }

                    const mesh = cubie.getMesh();
                    this.cubeGroup.add(mesh);
                }
            }
        }

        this.scene.add(this.cubeGroup);
    }

    isCubieOnFace(cubie, face) {
        const epsilon = 0.01;
        const position = cubie.getMesh().position;

        switch (face) {
            case 'U':
                return Math.abs(position.y - (this.cubeSize + this.spacing)) < epsilon;
            case 'D':
                return Math.abs(position.y + (this.cubeSize + this.spacing)) < epsilon;
            case 'F':
                return Math.abs(position.z - (this.cubeSize + this.spacing)) < epsilon;
            case 'B':
                return Math.abs(position.z + (this.cubeSize + this.spacing)) < epsilon;
            case 'L':
                return Math.abs(position.x + (this.cubeSize + this.spacing)) < epsilon;
            case 'R':
                return Math.abs(position.x - (this.cubeSize + this.spacing)) < epsilon;
            default:
                return false;
        }
    }

    addAxesHelper() {
        const axesHelper = new THREE.AxesHelper(2);
        this.scene.add(axesHelper);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }

    rotateFace(faceName, direction) {
        const face = this.faces[faceName];
        if (face) {
            face.rotateFace(direction);
        }
    }
}

export { Cube };