import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { setupColorPicker } from './color-picker.js';
import Cubie from './Cubie.js';
import Face from './Face.js';

class Cube {
    constructor() {
        this.faces = {};
        this.cubies = [];

        this.init();
    }

    createFaces() {
        const faceNames = ['U', 'D', 'L', 'R', 'F', 'B'];
        faceNames.forEach(name => {
            this.faces[name] = new Face(name, this);
        });
    }

    init() {
        this.faces = {};
        this.cubies = [];
        this.orientationMatrix = new THREE.Matrix4();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, 400 / 400, 0.1, 1000);
        this.camera.position.set(3, 3, 3);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(400, 400);
        document.getElementById('cube-container').appendChild(this.renderer.domElement);

        this.cubeGroup = new THREE.Group();
        this.cubeGroup.rotation.order = 'YXZ';

        this.faceMapping = {
            U: 'U',
            D: 'D',
            L: 'L',
            R: 'R',
            F: 'F',
            B: 'B'
        };
        
        this.rotationMappings = {
            left: {
                U: 'U',
                D: 'D',
                L: 'F',
                R: 'B',
                F: 'R',
                B: 'L'
            },
            right: {
                U: 'U',
                D: 'D',
                L: 'B',
                R: 'F',
                F: 'L',
                B: 'R'
            },
            down: {
                U: 'D',
                D: 'U',
                L: 'R',
                R: 'L',
                F: 'F',
                B: 'B'
            }
        };

        this.createFaces();
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
                    this.cubies.push(cubie);

                    // Add cubie to the appropriate faces
                    var tempName = '';
                    for (const face in this.faces) {
                        if (this.isCubieOnFace(cubie, face)) {
                            tempName += face;
                            this.faces[face].addCubie(cubie);
                        }
                        cubie.setName(tempName);
                    }

                    const mesh = cubie.getMesh();
                    this.cubeGroup.add(mesh);
                }
            }
        }

        this.scene.add(this.cubeGroup);
    }

    isCubieOnFace(cubie, face) {
        const epsilon = 0.2;
        const position = cubie.position;
        const mappedFace = this.faceMapping[face];

        switch (mappedFace) {
            case 'U':
                return Math.abs(position.y - 1) < epsilon;
            case 'D':
                return Math.abs(position.y + 1) < epsilon; 
            case 'L':
                return Math.abs(position.x + 1) < epsilon; 
            case 'R':
                return Math.abs(position.x - 1) < epsilon; 
            case 'F':
                return Math.abs(position.z - 1) < epsilon;
            case 'B':
                return Math.abs(position.z + 1) < epsilon;
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

    // getFace(faceName) {
    //     return this.faces[faceName];
    // }

    getMappedFace(faceName) {
        return this.faces[this.faceMapping[faceName]];
    }

    updateFaceMapping(direction) {
        const newMapping = {};
        Object.keys(this.faceMapping).forEach(face => {
            newMapping[face] = this.faceMapping[this.rotationMappings[direction][face]];
        });
        this.faceMapping = newMapping;
    }

    updateFaceAssignments() {
        Object.keys(this.faces).forEach(faceName => {
            this.getMappedFace(faceName).cubies = [];
        });

        // Reassign cubies to the correct faces
        this.cubies.forEach(cubie => {
            Object.keys(this.faces).forEach(faceName => {
                if (this.isCubieOnFace(cubie, faceName)) {
                    this.getMappedFace(faceName).addCubie(cubie);
                }
            });
        });

        for (const face in this.faces) {
            console.log(`Cubies on face ${this.faceMapping[face]}: ${this.getMappedFace(face).cubies.length}`);
        }
    }

    resetCube() {
        this.scene.remove(this.cubeGroup);
        
        this.cubies = [];
        this.cubeGroup = new THREE.Group();
        this.cubeGroup.rotation.order = 'YXZ';
    
        this.createFaces();
        this.createRubiksCube();

        this.faceMapping = {
            U: 'U',
            D: 'D',
            L: 'L',
            R: 'R',
            F: 'F',
            B: 'B'
        };
    
        this.scene.add(this.cubeGroup);
    }
    
}

export { Cube };