import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

let scene, camera, renderer, axesHelper, cubeGroup;

export function initCube() {
    scene = new THREE.Scene();

    // Position the camera to look at a corner of the cube
    camera = new THREE.PerspectiveCamera(60, 400 / 400, 0.1, 1000);
    camera.position.set(3, 3, 3); // Move the camera to the corner
    camera.lookAt(0, 0, 0); // Point the camera at the center of the cube

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(400, 400);
    document.getElementById('cube-container').appendChild(renderer.domElement);

    createRubiksCube();
    addAxesHelper(); // Add the axes helper to the camera
    animate();
}

function createRubiksCube() {
    const cubeSize = 0.8;
    const spacing = 0.05;

    cubeGroup = new THREE.Group(); // Create a group for the cube
    cubeGroup.rotation.order = 'YXZ'; // Set rotation order if needed

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
                const cubie = new THREE.Mesh(geometry, materials);
                cubie.position.set(x * (cubeSize + spacing), y * (cubeSize + spacing), z * (cubeSize + spacing));
                cubeGroup.add(cubie); // Add cubie to the cube group
            }
        }
    }

    scene.add(cubeGroup); // Add the cube group to the scene

    // Add axes helper to camera
    addAxesHelper();
}

function addAxesHelper() {
    axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper); // Add axes helper to camera
}

export function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

export { scene, camera, renderer, cubeGroup }; // Export scene, camera, renderer, and cubeGroup
