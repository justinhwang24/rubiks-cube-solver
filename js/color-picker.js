export function setupColorPicker() {
    const colorButtons = document.querySelectorAll('#color-picker .color-btn');
    let currentColor = '#ffffff'; // Default to white

    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentColor = button.dataset.color;
        });
    });

    // Set the current color on cubies
    document.querySelectorAll('#cube-container .cubie').forEach(cubie => {
        cubie.addEventListener('click', function () {
            this.material.forEach(mat => {
                if (mat.color.getHex() !== 0x000000) {
                    mat.color.set(currentColor);
                }
            });
        });
    });
}
