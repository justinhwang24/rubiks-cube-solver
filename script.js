import * as THREE from './three.module.min.js';

let scene, camera, renderer;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationSpeed = 0.4; // Adjust the speed of rotation

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(400, 400);
    document.getElementById('cube-container').appendChild(renderer.domElement);

    createRubiksCube();
    animate();
}

function createRubiksCube() {
    const cubeSize = 1;
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
                    new THREE.MeshBasicMaterial({ color: (x === 1 ? colors['R'] : 0x000000) }), // Right face
                    new THREE.MeshBasicMaterial({ color: (x === -1 ? colors['L'] : 0x000000) }), // Left face
                    new THREE.MeshBasicMaterial({ color: (y === 1 ? colors['U'] : 0x000000) }), // Up face
                    new THREE.MeshBasicMaterial({ color: (y === -1 ? colors['D'] : 0x000000) }), // Down face
                    new THREE.MeshBasicMaterial({ color: (z === 1 ? colors['F'] : 0x000000) }), // Front face
                    new THREE.MeshBasicMaterial({ color: (z === -1 ? colors['B'] : 0x000000) })  // Back face
                ];
                const cubie = new THREE.Mesh(geometry, materials);
                cubie.position.set(x * (cubeSize + spacing), y * (cubeSize + spacing), z * (cubeSize + spacing));
                scene.add(cubie);
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

document.addEventListener('mousedown', function (e) {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
});

document.addEventListener('mousemove', function (e) {
    if (isDragging) {
        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * rotationSpeed),
                toRadians(deltaMove.x * rotationSpeed),
                0,
                'XYZ'
            ));

        scene.quaternion.multiplyQuaternions(deltaRotationQuaternion, scene.quaternion);
        previousMousePosition = { x: e.clientX, y: e.clientY };
    }
});

document.addEventListener('mouseup', function () {
    isDragging = false;
});

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

window.onload = init;
