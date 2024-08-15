import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

export function setupControls(cube) {
    document.getElementById('left-btn').addEventListener('click', async function () {
        await logCubiePositionsAndFaces(cube, 'Before');
        await rotateCube(cube, 'left');
        await logCubiePositionsAndFaces(cube, 'After');
    });

    document.getElementById('down-btn').addEventListener('click', async function () {
        await logCubiePositionsAndFaces(cube, 'Before');
        await rotateCube(cube, 'down');
        await logCubiePositionsAndFaces(cube, 'Before');
    });

    document.getElementById('right-btn').addEventListener('click', async function () {
        await logCubiePositionsAndFaces(cube, 'Before');
        await rotateCube(cube, 'right');
        await logCubiePositionsAndFaces(cube, 'Before');
    });

    document.getElementById('scramble-btn').addEventListener('click', () => scrambleCube(cube));
    document.getElementById('reset-btn').addEventListener('click', () => cube.resetCube());

    document.getElementById('rotate-front-btn').addEventListener('click', () => {
        rotateFace(cube, 'F', true);
    });

    document.getElementById('rotate-right-btn').addEventListener('click', () => {
        rotateFace(cube, 'R', true);
    });

    document.getElementById('rotate-up-btn').addEventListener('click', () => {
        rotateFace(cube, 'U', true);
    });

    document.getElementById('rotate-back-btn').addEventListener('click', () => {
        rotateFace(cube, 'B', true);
    });

    document.getElementById('rotate-left-btn').addEventListener('click', () => {
        rotateFace(cube, 'L', true);
    });
    
    document.getElementById('rotate-down-btn').addEventListener('click', () => {
        rotateFace(cube, 'D', true);
    });
}

let lock = false;
let disable = false;

function lockButtons() {
    if (!lock) toggleButtons();
    lock = !lock;
    if (!lock) toggleButtons();
}

function toggleButtons() {
    if (lock) return;
    const buttonIds = [
        'left-btn', 'down-btn', 'right-btn', 
        'solve-btn', 'scramble-btn', 'reset-btn',
        'rotate-front-btn', 'rotate-right-btn', 'rotate-up-btn',
        'rotate-back-btn', 'rotate-left-btn', 'rotate-down-btn'
    ];

    buttonIds.forEach(id => {
        document.getElementById(id).disabled = !disable;
    });
    disable = !disable;
}

async function logCubiePositionsAndFaces(cube, when) {
    console.log(`\n=== ${when} Rotation ===`);
    cube.cubies.forEach(cubie => {
        const position = new THREE.Vector3();
        cubie.mesh.getWorldPosition(position);
        console.log(`Cubie Position: x=${position.x.toFixed(2)}, y=${position.y.toFixed(2)}, z=${position.z.toFixed(2)}`);
    });

    console.log("Face Assignments:");
    for (const faceName in cube.faces) {
        if (cube.faces.hasOwnProperty(faceName)) {
            const face = cube.faces[faceName];
            const cubieIds = face.cubies.map(cubie => cubie.getName());
            console.log(`Face ${faceName}: Cubies [${cubieIds.join(', ')}]`);
        }
    }
}

let isAnimating = false;

async function rotateCube(cube, direction) {
    return new Promise((resolve) => {
        if (isAnimating) return; // Prevent starting a new rotation if one is already in progress
        isAnimating = true;

        toggleButtons();

        const duration = 500; // Animation duration in milliseconds
        const startRotation = new THREE.Euler(cube.cubeGroup.rotation.x, cube.cubeGroup.rotation.y, cube.cubeGroup.rotation.z);
        const startTime = performance.now();

        // Update rotation based on the direction
        if (direction === 'left') {
            cube.cubeGroup.rotation.y -= Math.PI / 2;
        } else if (direction === 'down') {
            cube.cubeGroup.rotation.x += Math.PI;
        } else if (direction === 'right') {
            cube.cubeGroup.rotation.y += Math.PI / 2;
        }

        const targetRotation = new THREE.Euler(cube.cubeGroup.rotation.x, cube.cubeGroup.rotation.y, cube.cubeGroup.rotation.z);

        function animateRotation(time) {
            const elapsedTime = time - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Ensure progress is between 0 and 1

            cube.cubeGroup.rotation.x = THREE.MathUtils.lerp(startRotation.x, targetRotation.x, progress);
            cube.cubeGroup.rotation.y = THREE.MathUtils.lerp(startRotation.y, targetRotation.y, progress);
            cube.cubeGroup.rotation.z = THREE.MathUtils.lerp(startRotation.z, targetRotation.z, progress);

            cube.renderer.render(cube.scene, cube.camera);

            if (progress < 1) {
                requestAnimationFrame(animateRotation);
            } else {
                isAnimating = false;
                toggleButtons();
                cube.cubies.forEach(cubie => cubie.updatePosition());
                cube.updateFaceAssignments();
                resolve();
            }
        }

        requestAnimationFrame(animateRotation);
    });
}

async function scrambleCube(cube) {
    cube.resetCube();
    lockButtons();

    const moves = ['U', 'D', 'L', 'R', 'F', 'B'];
    const directions = ['', '2', '\'']; // No direction, 90° clockwise, 180°, 90° counter-clockwise

    let scramble = [];
    for (let i = 0; i < 20; i++) { // Number of scramble moves
        const move = moves[Math.floor(Math.random() * moves.length)];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        scramble.push(move + direction);
    }

    console.log('Scramble Sequence:', scramble.join(' '));

    for (let move of scramble) {
        await performMove(cube, move, 0.2);
    }
    lockButtons();
}

async function rotateFace(cube, faceName, clockwise, duration = 0.5) {
    return new Promise((resolve) => {
        if (isAnimating) return;
        isAnimating = true;
    
        toggleButtons();
    
        const face = cube.getFace(faceName);
        if (face) {
            face.rotateFace(clockwise, duration);
    
            setTimeout(() => {
                isAnimating = false;
                toggleButtons();
                resolve();
            }, duration * 1000);
        }
    });
}

async function performMove(cube, move, duration = 0.5) {
    const faceName = move[0];
    let clockwise = true;
    let rotate180 = false;
    const delay = 0.02;
    
    if (move.length > 1) {
        if (move[1] === '\'') {
            clockwise = false;
        }
        else if (move[1] === '2') {
            rotate180 = true;
        }
    }    
    if (rotate180) {
        await rotateFace(cube, faceName, true, duration);
        await new Promise(resolve => setTimeout(resolve, delay * 650)); // Delay between rotations
        await rotateFace(cube, faceName, true, duration);
    } else {
        await rotateFace(cube, faceName, clockwise, duration);
    }
    await new Promise(resolve => setTimeout(resolve, delay * 1000));
}
