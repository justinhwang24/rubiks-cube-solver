# Rubik's Cube Solver

Looking to solve a Rubik's Cube? This web app simulates a working Rubik's Cube. After scrambling the cube, you can generate a mathematically optimal solution to solve the cube within 20 moves.

**Link to project:** https://justinhwang24.github.io/rubiks-cube-solver/

## How It Works

**Tech used:** HTML, CSS, JavaScript

The app is powered by the `cuber` library for 3D rendering and manipulation of the Rubik's Cube, along with `cubejs` for the Two-Phase solving algorithm.

- **3D Rendering:** The `cuber` library is responsible for the 3D rendering and interactive manipulation of the Rubik's Cube. It allows users to rotate the cube, perform face rotations, and visualize the cube in its current state.

- **Two-Phase Algorithm:** Implemented in `solve.js`, this method optimizes the solution by first reducing the cube to a state that can be solved in a minimal number of moves, and then solving the reduced state.
    - **Phase 1:** The algorithm reduces the cube to a subset of predetermined states, using a breadth-first search (BFS) to find an intermediate solution.
    - **Phase 2:** It then uses a depth-first search (DFS) to find the optimal solution from this reduced set of states.
