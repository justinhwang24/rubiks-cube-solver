import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

export function setupControls(cube) {
    document.getElementById('left-btn').addEventListener('click', function () {
        console.log('Before:', cube.cubeGroup.rotation.x, cube.cubeGroup.rotation.y, cube.cubeGroup.rotation.z);
        rotateCube(cube, 'left');
        console.log('After:', cube.cubeGroup.rotation.x, cube.cubeGroup.rotation.y, cube.cubeGroup.rotation.z);
    });

    document.getElementById('down-btn').addEventListener('click', function () {
        console.log('Before:', cube.cubeGroup.rotation.x, cube.cubeGroup.rotation.y, cube.cubeGroup.rotation.z);
        rotateCube(cube, 'down');
        console.log('After:', cube.cubeGroup.rotation.x, cube.cubeGroup.rotation.y, cube.cubeGroup.rotation.z);
    });

    document.getElementById('right-btn').addEventListener('click', function () {
        console.log('Before:', cube.cubeGroup.rotation.x, cube.cubeGroup.rotation.y, cube.cubeGroup.rotation.z);
        rotateCube(cube, 'right');
        console.log('After:', cube.cubeGroup.rotation.x, cube.cubeGroup.rotation.y, cube.cubeGroup.rotation.z);
    });

    document.getElementById('scramble-btn').addEventListener('click', () => scrambleCube(cube));

    document.getElementById('rotate-front-btn').addEventListener('click', () => {
        console.log(cube.getFace('F').toString());
        cube.rotateFace('F', true);
    });

    document.getElementById('rotate-right-btn').addEventListener('click', () => {
        console.log(cube.getFace('R').toString());
        cube.rotateFace('R', true);
    });

    document.getElementById('rotate-up-btn').addEventListener('click', () => {
        console.log(cube.getFace('U').toString());
        cube.rotateFace('U', true);
    });

    document.getElementById('rotate-back-btn').addEventListener('click', () => {
        console.log(cube.getFace('B').toString());
        cube.rotateFace('B', true);
    });

    document.getElementById('rotate-left-btn').addEventListener('click', () => {
        console.log(cube.getFace('L').toString());
        cube.rotateFace('L', true);
    });
    
    document.getElementById('rotate-down-btn').addEventListener('click', () => {
        console.log(cube.getFace('D').toString());
        cube.rotateFace('D', true);
    });
}

let isAnimating = false;

function rotateCube(cube, direction) {
    if (isAnimating) return; // Prevent starting a new rotation if one is already in progress
    isAnimating = true;

    // Disable buttons
    document.getElementById('left-btn').disabled = true;
    document.getElementById('down-btn').disabled = true;
    document.getElementById('right-btn').disabled = true;

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
            // Re-enable buttons after animation completes
            isAnimating = false;
            document.getElementById('left-btn').disabled = false;
            document.getElementById('down-btn').disabled = false;
            document.getElementById('right-btn').disabled = false;
        }
    }

    requestAnimationFrame(animateRotation);
}

function rotateFace(cube, faceName, direction) {
    const face = cube.faces[faceName];
    if (face) {
        face.rotateFace(direction);
    }
}

function scrambleCube(cube) {
    const moves = ['U', 'D', 'L', 'R', 'F', 'B'];
    const directions = ['', '2', '\'']; // No direction, 90° clockwise, 180°, 90° counter-clockwise

    let scramble = [];
    for (let i = 0; i < 20; i++) { // Number of scramble moves
        const move = moves[Math.floor(Math.random() * moves.length)];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        scramble.push(move + direction);
    }

    console.log('Scramble Sequence:', scramble.join(' '));

    scramble.forEach(move => performMove(cube, move));
}

function performMove(cube, move) {
    const faceName = move[0];
    const direction = move.length > 1 ? (move[1] === '\'' ? 'counterclockwise' : move[1] === '2' ? '180' : 'clockwise') : 'clockwise';
    
    rotateFace(cube, faceName, direction);
}
