import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

let scene, camera, renderer;

export function init() {
    scene = new THREE.Scene();

    // Position the camera to look at a corner of the cube
    camera = new THREE.PerspectiveCamera(60, 400 / 400, 0.1, 1000);
    camera.position.set(3, 3, 3); // Move the camera to the corner
    camera.lookAt(0, 0, 0); // Point the camera at the center of the cube

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(400, 400);
    document.getElementById('cube-container').appendChild(renderer.domElement);

    createRubiksCube();
    animate();
}

function createRubiksCube() {
    const cubeSize = 0.8;
    const spacing = 0.05;
    const cubies = [];

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
                scene.add(cubie);
                cubies.push(cubie);
            }
        }
    }
}

export function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

let rotation = new THREE.Euler();

document.getElementById('yaw-btn').addEventListener('click', function () {
    rotation.y += Math.PI / 2;
    applyRotation();
});

document.getElementById('pitch-btn').addEventListener('click', function () {
    rotation.x += Math.PI / 2;
    applyRotation();
});

document.getElementById('roll-btn').addEventListener('click', function () {
    rotation.z += Math.PI / 2;
    applyRotation();
});

function applyRotation() {
    const targetRotation = new THREE.Euler(rotation.x, rotation.y, rotation.z);

    const duration = 500; // Animation duration in milliseconds
    const startRotation = new THREE.Euler(scene.rotation.x, scene.rotation.y, scene.rotation.z);
    const startTime = performance.now();

    function animateRotation(time) {
        const elapsedTime = time - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // Ensure progress is between 0 and 1

        scene.rotation.x = THREE.MathUtils.lerp(startRotation.x, targetRotation.x, progress);
        scene.rotation.y = THREE.MathUtils.lerp(startRotation.y, targetRotation.y, progress);
        scene.rotation.z = THREE.MathUtils.lerp(startRotation.z, targetRotation.z, progress);

        renderer.render(scene, camera);

        if (progress < 1) {
            requestAnimationFrame(animateRotation);
        }
    }

    requestAnimationFrame(animateRotation);
}

window.onload = init;