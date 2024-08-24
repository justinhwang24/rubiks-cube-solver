# Rubik's Cube Solver

Looking to solve a Rubik's Cube? This web app simulates a working Rubik's Cube. After scrambling the cube, you can generate a mathematically optimal solution to solve the cube in less than 21 moves.

**Link to project:** Coming soon

## How It Works

**Tech used:** HTML, CSS, JavaScript

The app is powered by the `cuber` library for 3D rendering and manipulation of the Rubik's Cube, along with `cubejs` for the Two-Phase solving algorithm.

- **Two-Phase Algorithm:** Implemented in `solve.js`, this method optimizes the solution by first reducing the cube to a state that can be solved in a minimal number of moves, and then applying those moves.

- **3D Rendering:** The `cuber` library is responsible for the 3D rendering and interactive manipulation of the Rubik's Cube. It allows users to rotate the cube, perform face rotations, and visualize the cube in its current state.

