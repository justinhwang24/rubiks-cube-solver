import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { cubeGroup, renderer, camera } from './cube.js';

let currentColor = '#ffffff';

export function setupColorPicker() {
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', function () {
            currentColor = this.getAttribute('data-color');

            colorButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Add event listener to the cube's faces
    cubeGroup.children.forEach(cubie => {
        cubie.userData = { 
            x: cubie.position.x,
            y: cubie.position.y,
            z: cubie.position.z
        };

        cubie.callback = function () {
            this.material.forEach(mat => {
                if (mat.color.getHex() !== 0x000000) {
                    mat.color.set(currentColor);
                }
            });
        };
    });

    document.getElementById('cube-container').addEventListener('click', onCubeClick);
}

function onCubeClick(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.layers.set(0);

    const intersects = raycaster.intersectObjects(cubeGroup.children);

    if (intersects.length > 0) {
        const faceIndex = intersects[0].face.materialIndex;
        const selectedCubie = intersects[0].object;

        // Check if the face's current color is black
        const currentMaterial = selectedCubie.material[faceIndex];
        if (currentMaterial.color.getHex() === 0x000000) {
            console.log('Face is already black, skipping color change.');
            return;
        }

        selectedCubie.material[faceIndex].color.set(currentColor);
    }
}