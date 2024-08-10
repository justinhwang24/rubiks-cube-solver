import { initCube } from './cube.js';
import { setupControls } from './controls.js';
import { setupColorPicker } from './color-picker.js';

window.onload = () => {
    initCube();
    setupControls();
    setupColorPicker();
};
