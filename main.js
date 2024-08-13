import { Cube } from './src/components/Cube/cube.js';
import { setupControls } from './src/components/Cube/controls.js';
import { setupColorPicker } from './src/components/Cube/color-picker.js';

window.onload = () => {
    const cube = new Cube();
    setupControls(cube);
};
