import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { cubeGroup, scene, camera, renderer } from './cube.js';

export function setupControls() {
    document.getElementById('left-btn').addEventListener('click', function () {
        console.log('Before:', cubeGroup.rotation.x, cubeGroup.rotation.y, cubeGroup.rotation.z);
        rotateCube('left');
        console.log('After:', cubeGroup.rotation.x, cubeGroup.rotation.y, cubeGroup.rotation.z);
    });

    document.getElementById('down-btn').addEventListener('click', function () {
        console.log('Before:', cubeGroup.rotation.x, cubeGroup.rotation.y, cubeGroup.rotation.z);
        rotateCube('down');
        console.log('After:', cubeGroup.rotation.x, cubeGroup.rotation.y, cubeGroup.rotation.z);
    });

    document.getElementById('right-btn').addEventListener('click', function () {
        console.log('Before:', cubeGroup.rotation.x, cubeGroup.rotation.y, cubeGroup.rotation.z);
        rotateCube('right');
        console.log('After:', cubeGroup.rotation.x, cubeGroup.rotation.y, cubeGroup.rotation.z);
    });
}

let isAnimating = false;

function rotateCube(direction) {
    if (isAnimating) return; // Prevent starting a new rotation if one is already in progress
    isAnimating = true;

    // Disable buttons
    document.getElementById('left-btn').disabled = true;
    document.getElementById('down-btn').disabled = true;
    document.getElementById('right-btn').disabled = true;

    const duration = 500; // Animation duration in milliseconds
    const startRotation = new THREE.Euler(cubeGroup.rotation.x, cubeGroup.rotation.y, cubeGroup.rotation.z);
    const startTime = performance.now();

    // Update rotation based on the direction
    if (direction === 'left') {
        cubeGroup.rotation.y -= Math.PI / 2;
    } else if (direction === 'down') {
        cubeGroup.rotation.x += Math.PI;
    } else if (direction === 'right') {
        cubeGroup.rotation.y += Math.PI / 2;
    }

    const targetRotation = new THREE.Euler(cubeGroup.rotation.x, cubeGroup.rotation.y, cubeGroup.rotation.z);

    function animateRotation(time) {
        const elapsedTime = time - startTime;
        const progress = Math.min(elapsedTime / duration, 1); // Ensure progress is between 0 and 1

        cubeGroup.rotation.x = THREE.MathUtils.lerp(startRotation.x, targetRotation.x, progress);
        cubeGroup.rotation.y = THREE.MathUtils.lerp(startRotation.y, targetRotation.y, progress);
        cubeGroup.rotation.z = THREE.MathUtils.lerp(startRotation.z, targetRotation.z, progress);

        renderer.render(scene, camera);

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
